import styled from 'styled-components';
import Header from '../components/sidebar/Navbar';
import Footer from '../components/Footer';
import { useState, useEffect, useCallback, useRef } from 'react';
import API_BASE_URL from '../config/api';

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

function FilaSeparacao() {
  const [fitas, setFitas] = useState<Fita[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const refreshInterval = 3; // 3 segundos

  // Função de busca de dados encapsulada em useCallback para evitar recriação desnecessária
  const fetchFitas = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/fitas/aguardando-selagem`);
      const data = await response.json();
      
      if (response.ok) {
        // Transformar os dados para adicionar o status
        const fitasComStatus = (data.fitas || []).map((fita: Fita) => ({
          ...fita,
          medicamentos: fita.medicamentos.map((med: Medicamento) => ({
            ...med,
            id: med.id || Math.random(), // Fallback para ID caso não venha do backend
            status: med.status || 'aprovado' // Assume 'aprovado' como status padrão
          }))
        }));
        setFitas(fitasComStatus);
        setError(null); // Limpa erros anteriores se a requisição for bem sucedida
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

  // Configuração do polling automático
  useEffect(() => {
    // Chamada inicial
    fetchFitas();
    
    // Configurar polling a cada 3 segundos
    pollingRef.current = setInterval(() => {
      fetchFitas();
    }, refreshInterval * 1000);
    
    // Cleanup quando o componente for desmontado
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
        // Atualiza o estado local para refletir a mudança
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

  // Nova função para iniciar a separação de todos os medicamentos de uma fita
  const iniciarSeparacaoFitaCompleta = async (fita: Fita) => {
    try {
      // Filtra apenas medicamentos que estão em status aprovado
      const medicamentosAprovados = fita.medicamentos.filter(
        med => med.status === 'aprovado'
      );
      
      if (medicamentosAprovados.length === 0) {
        setError('Não há medicamentos disponíveis para separar nesta fita');
        return;
      }
      
      // Atualiza o status no frontend imediatamente para feedback visual
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
      
      // Atualiza cada medicamento no backend
      const atualizacoes = medicamentosAprovados.map(medicamento => 
        atualizarStatusMedicamento(medicamento.id, 'em_separacao')
      );
      
      await Promise.all(atualizacoes);
      
      // Aqui seria o ponto para ativar o Dobot (implementação futura)
      console.log('Iniciando separação da fita completa:', fita.id);
      
    } catch (err) {
      setError('Erro ao iniciar separação da fita');
      console.error('Erro ao iniciar separação da fita:', err);
    }
  };

  // Determina o status de andamento da fita com base nos status dos medicamentos
  const getStatusAndamento = (medicamentos: Medicamento[]) => {
    if (medicamentos.length === 0) return "aguardando";
    
    if (medicamentos.every(med => med.status === 'separado')) return "separado";
    
    if (medicamentos.some(med => med.status === 'em_separacao')) return "em andamento";
    
    return "aguardando";
  };

  // Verifica se a fita pode iniciar separação (tem pelo menos um medicamento em status aprovado)
  const fitaPodeIniciarSeparacao = (medicamentos: Medicamento[]) => {
    return medicamentos.some(med => med.status === 'aprovado');
  };

  return (
    <PageContainer>
      <nav><Header /></nav>
      <PageContent>
        <PageHeader>
          <h1>Fila de Separação</h1>
        </PageHeader>
        
        <ControlsContainer>
          <PauseButton>
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
            <NoItemsMessage>Não há fitas aguardando separação no momento</NoItemsMessage>
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
  )
};

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
  width: 100%;
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

// Área de altura fixa para mensagens de carregamento e erro
const LoadingArea = styled.div`
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  height: 50px; /* Altura fixa em vez de min-height */
  position: relative; /* Para posicionamento absoluto dos filhos */
  margin-bottom: 1rem;
`;

// Novo componente para envolver as mensagens
interface MessageContainerProps {
  visible: boolean;
}

const MessageContainer = styled.div<MessageContainerProps>`
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
    Background-Color: #2C3E50;
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

// Botão para separação de fita inteira
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
  font-weight: 500;
  width: 100%;
`;

const FooterWrapper = styled.div`
  width: 100%;
  margin-top: auto;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
`;

export default FilaSeparacao;
