import styled from 'styled-components';
import Header from '../components/sidebar/Navbar';
import Footer from '../components/Footer';
import { useState, useEffect, useCallback, useRef } from 'react';
import API_BASE_URL from '../config/api';
import mqtt from 'mqtt';

interface Medicamento {
  id: number;
  medicamento: string;
  quantidade: number;
  status: string;
}

interface Fita {
  id: number;
  nome: string;
  dateTime: string;
  medicamentos: Medicamento[];
}

interface MqttMessage {
  topic: string;
  timestamp: string;
  payload: any;
  type: 'info' | 'warning' | 'error' | 'success';
}

const formatMqttMessage = (message: MqttMessage) => {
  const { acao, detalhes } = message.payload || {};
  const hora = new Date(message.timestamp).toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });

  // Safe access functions to prevent "cannot read property of undefined" errors
  const safeGetCoord = (coord: 'x' | 'y') => {
    if (detalhes?.coordenadas) {
      return detalhes.coordenadas[coord];
    }
    return 'N/A';
  };

  const safeGetDetail = (key: string, defaultValue: string = 'N/A') => {
    return detalhes && detalhes[key] !== undefined ? detalhes[key] : defaultValue;
  };

  const messages: { [key: string]: { text: string; icon: string } } = {
    'fim_montagem': { icon: '✅', text: `Montagem concluída: ${safeGetDetail('message')}` },
    'iniciando_medicamento': { icon: '📦', text: `Iniciando separação: Medicamento ${safeGetDetail('medicamento')} (${safeGetDetail('quantidade')} un.)` },
    'movimento_iniciado': { icon: '🔄', text: `Movendo para posição X:${safeGetCoord('x')} Y:${safeGetCoord('y')}` },
    'movimento_concluido': { icon: '✓', text: `Posição alcançada: X:${safeGetCoord('x')} Y:${safeGetCoord('y')}` },
    'ventosa_ativa': { icon: '🎛', text: `Ventosa ${safeGetDetail('estado') === 'ON' ? 'ativada' : 'desativada'}` },
    'qr_detectado': { icon: '📷', text: `QR Code lido: ${detalhes?.conteudo ? JSON.parse(detalhes.conteudo).principio : 'N/A'}` },
    'unidade_concluida': { icon: '✔', text: `Unidade concluída: ${safeGetDetail('unidade_atual')}/${safeGetDetail('total_unidades')}` },
    'leitura_qr_iniciada': { icon: '⏳', text: 'Aguardando leitura do QR Code...' },
    'aguardando_qr': { icon: '⌛', text: 'Pronto para nova leitura' },
    'posicao_inicial': { icon: '🏠', text: 'Retornando à posição inicial' },
    'configuracao_inicial': { icon: '⚙', text: `Velocidade ajustada: ${safeGetDetail('velocidade')}%` },
    'retorno_home': { icon: '🏠', text: 'Indo para posição de espera' },
    'erro': { icon: '❌', text: `Erro: ${safeGetDetail('message')}` },
    'iniciando_unidade': { icon: '⚡', text: `Iniciando unidade ${safeGetDetail('unidade_atual')}` }
  };

  return {
    ...messages[acao] || { icon: 'ℹ', text: `Ação: ${acao || 'desconhecida'}` },
    hora,
    type: message.type
  };
};

const determineMessageType = (topic: string, payload: any): MqttMessage['type'] => {
  if (topic.includes('error')) return 'error';
  if (payload.erro || payload.error) return 'error';
  if (topic.includes('warning')) return 'warning';
  if (payload.status === 'success') return 'success';
  return 'info';
};

function FilaSeparacao() {
  const [fitas, setFitas] = useState<Fita[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [latestMessage, setLatestMessage] = useState<MqttMessage | null>(null);
  const [mqttConnected, setMqttConnected] = useState(false);
  const [dobotStatus, setDobotStatus] = useState<'conectado' | 'desconectado'>('desconectado');
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const mqttClientRef = useRef<mqtt.MqttClient | null>(null);
  const refreshInterval = 3;

  useEffect(() => {
    const client = mqtt.connect('ws://broker.emqx.io:8083/mqtt', {
      clientId: `webClient_${Math.random().toString(16).substr(2, 8)}`,
      clean: true,
      reconnectPeriod: 1000,
      connectTimeout: 30000,
    });
    
    client.on('connect', () => {
      console.log('Conectado ao broker MQTT');
      setMqttConnected(true);
      
      // Subscribe to both topics
      client.subscribe(['dobot/acoes', 'dobot/status'], (err) => {
        if (!err) console.log('Subscrito nos tópicos MQTT');
      });
    });

    client.on('message', (topic, message) => {
      try {
        const payload = JSON.parse(message.toString());
        
        // Handle dobot status updates
        if (topic === 'dobot/status') {
          setDobotStatus(payload.status.toLowerCase());
          return;
        }
        
        // Handle action messages
        if (topic === 'dobot/acoes') {
          // Validate the payload has the expected structure
          if (!payload || typeof payload !== 'object') {
            console.error('Invalid MQTT payload format:', payload);
            return;
          }
          
          const newMessage: MqttMessage = {
            topic,
            timestamp: new Date().toISOString(),
            payload,
            type: determineMessageType(topic, payload)
          };
          setLatestMessage(newMessage);
        }
      } catch (e) {
        console.error('Erro ao processar mensagem MQTT:', e);
      }
    });

    client.on('error', (err) => {
      console.error('Erro MQTT:', err);
      setMqttConnected(false);
    });

    mqttClientRef.current = client;

    return () => {
      client.end();
    };
  }, []);

  const fetchFitas = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/fitas/aguardando-selagem`);
      const data = await response.json();
      
      if (response.ok) {
        const fitasComStatus = (data.fitas || []).map((fita: Fita) => ({
          ...fita,
          medicamentos: fita.medicamentos.map((med: Medicamento) => ({
            ...med,
            id: med.id || Math.random(),
            status: med.status || 'aprovado'
          }))
        })); 
        setFitas(fitasComStatus);
        setError(null);
      } else {
        setError(data.error || 'Erro ao buscar dados');
      }
    } catch (err) {
      setError('Erro ao conectar ao servidor');
      console.error('Erro ao buscar fitas:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFitas();
    
    pollingRef.current = setInterval(() => {
      fetchFitas();
    }, refreshInterval * 1000);
    
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [fetchFitas]);

  const atualizarStatusMedicamento = async (medicamentoId: number, novoStatus: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/fitas/atualizar-status-medicamento`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: medicamentoId,
          status: novoStatus
        }),
      });

      if (response.ok) {
        setFitas(prevFitas => 
          prevFitas.map(fita => ({
            ...fita,
            medicamentos: fita.medicamentos.map(med => 
              med.id === medicamentoId ? { ...med, status: novoStatus } : med
            )
          }))
        );
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erro ao atualizar status');
      }
    } catch (err) {
      setError('Erro ao conectar ao servidor');
      console.error('Erro ao atualizar status:', err);
    }
  };

  const iniciarSeparacaoFitaCompleta = async (fita: Fita) => {
    try {
      const medicamentosAprovados = fita.medicamentos.filter(
        med => med.status === 'aprovado'
      );
      
      if (medicamentosAprovados.length === 0) {
        setError('Não há medicamentos disponíveis para separar nesta fita');
        return;
      }
      
      setFitas(prevFitas => 
        prevFitas.map(f => {
          if (f.id === fita.id) {
            return {
              ...f,
              medicamentos: f.medicamentos.map(med => 
                med.status === 'aprovado' ? { ...med, status: 'em_separacao' } : med
              )
            };
          }
          return f;
        })
      );
      
      const atualizacoes = medicamentosAprovados.map(medicamento => 
        atualizarStatusMedicamento(medicamento.id, 'em_separacao')
      );
      
      await Promise.all(atualizacoes);
      
    } catch (err) {
      setError('Erro ao iniciar separação da fita');
      console.error('Erro ao iniciar separação da fita:', err);
    }
  };

  const getStatusAndamento = (medicamentos: Medicamento[]) => {
    if (medicamentos.length === 0) return "aguardando";
    if (medicamentos.every(med => med.status === 'separado')) return "separado";
    if (medicamentos.some(med => med.status === 'em_separacao')) return "em andamento";
    return "aguardando";
  };

  const fitaPodeIniciarSeparacao = (medicamentos: Medicamento[]) => {
    return medicamentos.some(med => med.status === 'aprovado');
  };

  return (
    <PageContainer>
      <nav><Header /></nav>
      
      <MqttSidePanel>
        <MqttHeader>
          Status do Robô - {mqttConnected ? 'Conectado' : 'Desconectado'}
          <StatusIndicator connected={mqttConnected} />
        </MqttHeader>
        
        <DobotStatusBar>
          Dobot: <DobotStatusIndicator status={dobotStatus}>{dobotStatus}</DobotStatusIndicator>
        </DobotStatusBar>

        <CurrentMessageContainer>
          {latestMessage && (
            <MessageBubble type={latestMessage.type}>
              <MessageHeader>
                <TimeStamp>{formatMqttMessage(latestMessage).hora}</TimeStamp>
                <StatusTag type={latestMessage.type}>
                  {latestMessage.type.toUpperCase()}
                </StatusTag>
              </MessageHeader>
              
              <MessageContent>
                <MessageIcon>
                  {formatMqttMessage(latestMessage).icon}
                </MessageIcon>
                {formatMqttMessage(latestMessage).text}
              </MessageContent>

              {latestMessage.payload?.detalhes && Object.keys(latestMessage.payload.detalhes).length > 0 && (
                <DetailsBox>
                  {Object.entries(latestMessage.payload.detalhes).map(([key, value]) => (
                    typeof value === 'object' && value !== null ? 
                      // Handle nested objects
                      Object.entries(value as Record<string, any>).map(([subKey, subValue]) => (
                        <DetailItem key={`${key}-${subKey}`}>
                          <DetailLabel>{subKey}:</DetailLabel>
                          <DetailValue>{String(subValue)}</DetailValue>
                        </DetailItem>
                      ))
                    : 
                      // Handle simple key-value pairs
                      <DetailItem key={key}>
                        <DetailLabel>{key}:</DetailLabel>
                        <DetailValue>{String(value)}</DetailValue>
                      </DetailItem>
                  ))}
                </DetailsBox>
              )}
            </MessageBubble>
          )}
        </CurrentMessageContainer>
      </MqttSidePanel>

      <PageContent>
        <PageHeader>
          <h1>Fila de Separação</h1>
        </PageHeader>
        
        <ControlsContainer>
          <PauseButton disabled={dobotStatus !== 'conectado'}>
            ⏸️ Pausar Montagem
          </PauseButton>
        </ControlsContainer>
        
        <LoadingArea>
          <MessageContainer visible={loading}>
            <LoadingMessage>Carregando fitas...</LoadingMessage>
          </MessageContainer>
          <MessageContainer visible={!!error}>
            <ErrorMessage>{error}</ErrorMessage>
          </MessageContainer>
        </LoadingArea>
        
        <ContentSection>
          {fitas.length === 0 && !loading && (
            <NoItemsMessage>
              Não há fitas aguardando separação no momento
            </NoItemsMessage>
          )}
          
          {fitas.map((fita) => (
            <FitaBox key={fita.id}>
              <div className='topo-fita'>
                <div className="dados">
                  <h3>{fita.nome}</h3>
                  <p>Início: {fita.dateTime}</p>
                </div>

                <div className="controles-fita">
                  <div className="andamento">
                    {getStatusAndamento(fita.medicamentos)}
                  </div>
                  
                  {fitaPodeIniciarSeparacao(fita.medicamentos) && (
                    <FitaButton 
                      onClick={() => iniciarSeparacaoFitaCompleta(fita)}
                      disabled={dobotStatus !== 'conectado'}
                    >
                      Iniciar Separação da Fita
                    </FitaButton>
                  )}
                </div>
              </div>
              
              {fita.medicamentos.map((medicamento) => (
                <StatusBox key={medicamento.id} status={medicamento.status || 'aprovado'}>
                  <div className="informacoes">
                    <span>{medicamento.medicamento}</span>
                    <p>Quantidade: {medicamento.quantidade}</p>
                  </div>
                  <div className="status-controls">
                    <div className="status">{medicamento.status || 'aprovado'}</div>
                    {(medicamento.status !== 'separado') && (
                      <div className="action-buttons">
                        {medicamento.status === 'em_separacao' && (
                          <StatusButton 
                            status="separado" 
                            onClick={() => atualizarStatusMedicamento(medicamento.id, 'separado')}
                            disabled={dobotStatus !== 'conectado'}
                          >
                            Finalizar separação
                          </StatusButton>
                        )}
                      </div>
                    )}
                  </div>
                </StatusBox>
              ))}
            </FitaBox>
          ))}
        </ContentSection>
      </PageContent>
      
      <FooterWrapper>
        <Footer />
      </FooterWrapper>
    </PageContainer>
  );
}

const DobotStatusBar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 15px;
  background-color: #f1f1f1;
  border-radius: 8px;
  margin-bottom: 15px;
  font-weight: 500;
`;

const DobotStatusIndicator = styled.span<{ status: 'conectado' | 'desconectado' }>`
  padding: 5px 10px;
  border-radius: 20px;
  background-color: ${props => props.status === 'conectado' ? '#28a745' : '#dc3545'};
  color: white;
  font-size: 14px;
  text-transform: capitalize;
`;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  position: relative;
`;

const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100% - 350px);
  padding: 0 15px;
  margin-top: 70px;
  padding-bottom: 80px;
`;

const ContentSection = styled.div`
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const PageHeader = styled.div`
  width: 90%;
  max-width: 1200px;
  padding: 0 15px;
  margin: 2rem auto 1rem;
  
  h1 {
    color: #34495E;
    font-size: clamp(24px, 5vw, 36px);
    font-weight: 900;
  }
`;

const ControlsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 90%;
  max-width: 1200px;
  margin: 0 auto 1rem;
`;

const LoadingArea = styled.div`
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  height: 50px;
  position: relative;
  margin-bottom: 1rem;
`;

const MessageContainer = styled.div<{ visible: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 0.2s ease-in-out;
  pointer-events: ${props => props.visible ? 'auto' : 'none'};
`;

const PauseButton = styled.button`
  background-color: #E87722; 
  color: white; 
  border: none; 
  padding: 12px 20px; 
  border-radius: 5px; 
  font-weight: bold; 
  cursor: pointer;
  font-size: clamp(14px, 3vw, 16px);
`;

const FitaBox = styled.div`
  width: 100%;
  background-color: #2C3E50;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 1rem;
  border-radius: 15px;
  margin-bottom: 10px;

  .topo-fita {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
    color: white;
    
    @media (min-width: 576px) {
      width: 90%;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }

  .topo-fita h3 {
    font-size: clamp(18px, 4vw, 24px);
    font-weight: 550;
    margin: 0;
  }

  .topo-fita p {
    margin: 0;
    font-size: clamp(14px, 3vw, 16px);
  }

  .controles-fita {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    
    @media (min-width: 576px) {
      flex-direction: row;
      width: auto;
      align-items: center;
    }
  }

  .andamento {
    background-color: gray;
    padding: 10px;
    border-radius: 20px;
    width: 100%;
    text-align: center;
    
    @media (min-width: 576px) {
      width: auto;
      padding: 15px;
    }
  }
`;

const FitaButton = styled.button`
  background-color: #3498DB;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  
  &:hover {
    background-color: #2980B9;
  }
  
  @media (min-width: 576px) {
    width: auto;
    white-space: nowrap;
  }
`;

interface StatusBoxProps {
  status: string;
}

const StatusBox = styled.div<StatusBoxProps>`
  background-color: ${(props) =>
    props.status === "separado" ? "#71E9667D" :
    props.status === "em_separacao" ? "#ECBB59" :
    props.status === "aprovado" ? "#E9B78A" : "#808080"};
  padding: 15px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  text-transform: capitalize;
  color: white;
  margin: 5px 0;
  
  @media (min-width: 576px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 20px 30px;
  }

  .informacoes span {
    font-size: clamp(18px, 4vw, 24px);
    font-weight: 550;
    margin: 0;
    word-break: break-word;
  }

  .informacoes p {
    font-size: clamp(14px, 3vw, 16px);
    font-weight: 500;
    margin: 0;
  }

  .status-controls {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 10px;
    margin-top: 10px;
    
    @media (min-width: 576px) {
      margin-top: 0;
      flex-direction: row;
      gap: 20px;
    }
  }

  .status {
    font-size: clamp(16px, 3.5vw, 20px);
    font-weight: 550;
  }
  
  .action-buttons {
    display: flex;
    gap: 8px;
  }
`;

interface StatusButtonProps {
  status: string;
}

const StatusButton = styled.button<StatusButtonProps>`
  background-color: ${(props) =>
    props.status === "separado" ? "#27AE60" :
    props.status === "em_separacao" ? "#F39C12" : "#3498DB"};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    opacity: 0.9;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 15px;
  color: #3498db;
  font-weight: 500;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 15px;
  color: #e74c3c;
  background-color: rgba(231, 76, 60, 0.1);
  border-radius: 5px;
  width: 100%;
`;

const NoItemsMessage = styled.div`
  text-align: center;
  padding: 30px 15px;
  color: #7f8c8d;
  background-color: #f8f9fa;
  border-radius: 10px;
`;

const FooterWrapper = styled.div`
  width: 100%;
  position: relative;
  margin-top: auto;
`;

const MqttSidePanel = styled.div`
  position: fixed;
  right: 0;
  top: 70px;
  width: 350px;
  height: calc(100vh - 70px);
  background-color: #f8f9fa;
  border-left: 1px solid #dee2e6;
  overflow-y: auto;
  padding: 15px;
  box-shadow: -2px 0 8px rgba(0,0,0,0.05);
`;

const CurrentMessageContainer = styled.div`
  height: calc(100% - 50px);
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const MessageBubble = styled.div<{ type: string }>`
  background: ${props => {
    switch (props.type) {
      case 'error': return '#f8d7da';
      case 'warning': return '#fff3cd';
      case 'success': return '#d4edda';
      default: return '#e2e3e5';
    }
  }};
  border: 1px solid ${props => {
    switch (props.type) {
      case 'error': return '#f5c6cb';
      case 'warning': return '#ffeeba';
      case 'success': return '#c3e6cb';
      default: return '#d3d6d8';
    }
  }};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 15px;
  animation: fadeIn 0.3s ease-in;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const MessageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const TimeStamp = styled.span`
  font-size: 0.85em;
  color: #6c757d;
`;

const StatusTag = styled.span<{ type: string }>`
  font-size: 0.75em;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: ${props => {
    switch (props.type) {
      case 'error': return '#dc3545';
      case 'warning': return '#ffc107';
      case 'success': return '#28a745';
      default: return '#17a2b8';
    }
  }};
  color: white;
`;

const MessageContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.1em;
  color: #2c3e50;
  line-height: 1.4;
`;

const MessageIcon = styled.span`
  font-size: 1.4em;
`;

const DetailsBox = styled.div`
  margin-top: 15px;
  padding: 12px;
  background-color: rgba(255,255,255,0.9);
  border-radius: 8px;
  border: 1px solid #dee2e6;
`;

const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 8px 0;
  font-size: 0.9em;
`;

const DetailLabel = styled.span`
  font-weight: 500;
  color: #34495e;
`;

const DetailValue = styled.span`
  color: #7f8c8d;
  max-width: 60%;
  text-align: right;
  word-break: break-word;
`;

const MqttHeader = styled.div`
  font-size: 18px;
  font-weight: bold;
  padding: 15px;
  background-color: #34495e;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const StatusIndicator = styled.div<{ connected: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => (props.connected ? '#28a745' : '#dc3545')};
  box-shadow: 0 0 8px ${props => (props.connected ? 'rgba(40,167,69,0.3)' : 'rgba(220,53,69,0.3)')};
`;

export default FilaSeparacao;