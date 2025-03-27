import React from 'react';
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/sidebar/Navbar';
import { HiOutlineClock } from "react-icons/hi2";
import Popup from 'reactjs-popup';
import API_BASE_URL from '../config/api';

interface Medication {
  id: number;
  nome: string;
  dosagem: string;
}

interface PrescricaoMedicamento {
  id: number;
  id_medicamento: number;
  quantidade: number;
  nome_medicamento?: string;
  dosagem?: string;
}

interface PrescricaoOnHold {
  id: number;
  id_medico: number;
  id_paciente: number;
  data_prescricao: string;
  nome_medico?: string;
  nome_paciente?: string;
  hc_paciente?: string;
}

const Prescricoes = () => {
  const [prescricoesOnHold, setPrescricoesOnHold] = useState<PrescricaoOnHold[]>([]);
  const [availableMedications, setAvailableMedications] = useState<Medication[]>([]);
  const [selectedPrescricao, setSelectedPrescricao] = useState<number | null>(null);
  const [selectedPatientName, setSelectedPatientName] = useState<string | null>(null);
  const [selectedMedications, setSelectedMedications] = useState<Array<PrescricaoMedicamento>>([]);
  const [medicationToAdd, setMedicationToAdd] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPrescricoesOnHold();
    fetchAvailableMedications();
  }, []);

  const fetchPrescricoesOnHold = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/prescricao_on_hold/read-all`, { method: 'GET' });
      const data = await response.json();
      if (response.ok) {
        // Para cada prescrição, buscar dados do paciente e médico
        const prescricoesDetalhadas = await Promise.all((data.PrescricaoOnHold || []).map(async (prescricao: PrescricaoOnHold) => {
          // Buscar dados do paciente
          const pacienteResponse = await fetch(`${API_BASE_URL}/paciente/read-id`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: prescricao.id_paciente })
          });
          const pacienteData = await pacienteResponse.json();
          
          // Buscar dados do médico.
          const medicoResponse = await fetch(`${API_BASE_URL}/medico/read-id`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: prescricao.id_medico })
          });
          const medicoData = await medicoResponse.json();
          
          return {
            ...prescricao,
            nome_paciente: pacienteData.paciente?.nome || '',
            hc_paciente: pacienteData.paciente?.hc || '',
            nome_medico: medicoData.medico?.nome || ''
          };
        }));
        
        setPrescricoesOnHold(prescricoesDetalhadas);
      } else {
        setError(data.error || 'Erro ao buscar prescrições');
      }
    } catch (error) {
      setError('Erro ao conectar ao backend');
      console.error('Erro ao conectar ao backend:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAvailableMedications = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/medicamento/read-all`, { method: 'GET' });
      const data = await response.json();
      if (response.ok) {
        setAvailableMedications(data.medicamentos || []);
      } else {
        console.error(data.error || 'Erro ao buscar medicamentos disponíveis');
      }
    } catch (error) {
      console.error('Erro ao conectar ao backend:', error);
    }
  };

  const handleEditClick = async (prescricaoId: number, patientName: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Buscar medicamentos associados a esta prescrição
      const response = await fetch(`${API_BASE_URL}/prescricao_medicamento/read-all`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_prescricao_on_hold: prescricaoId }),
      });
      const data = await response.json();
      
      if (response.ok) {
        const medicamentos = data.prescricoes_medicamento || [];
        
        // Para cada medicamento, buscar detalhes complementares
        const medicamentosDetalhados = await Promise.all(medicamentos.map(async (med: PrescricaoMedicamento) => {
          const medResponse = await fetch(`${API_BASE_URL}/medicamento/read-id`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: med.id_medicamento }),
          });
          const medData = await medResponse.json();
          
          return {
            ...med,
            nome_medicamento: medData.medicamento?.nome || 'Medicamento não encontrado',
            dosagem: medData.medicamento?.dosagem || 'Dosagem não disponível'
          };
        }));
        
        setSelectedPrescricao(prescricaoId);
        setSelectedPatientName(patientName);
        setSelectedMedications(medicamentosDetalhados);
        
        // Definir o primeiro medicamento disponível para adição
        if (availableMedications.length > 0) {
          const usedMedicationIds = medicamentosDetalhados.map(med => med.id_medicamento);
          const availableMed = availableMedications.find(med => !usedMedicationIds.includes(med.id));
          setMedicationToAdd(availableMed?.id || null);
        }
      } else {
        setError(data.error || 'Erro ao buscar detalhes da prescrição');
      }
    } catch (error) {
      setError('Erro ao conectar ao backend');
      console.error('Erro ao conectar ao backend:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAvailableMedications = () => {
    const selectedIds = selectedMedications.map(med => med.id_medicamento);
    return availableMedications.filter(med => !selectedIds.includes(med.id));
  };

  const handleAddMedication = async () => {
    if (medicationToAdd && selectedPrescricao) {
      setIsLoading(true);
      try {
        const medToAdd = availableMedications.find(med => med.id === medicationToAdd);
        
        if (medToAdd) {
          // Adicionar novo medicamento à prescrição
          const response = await fetch(`${API_BASE_URL}/prescricao_medicamento/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id_prescricao_on_hold: selectedPrescricao,
              id_medicamento: medToAdd.id,
              quantidade: 1,
              status_medicamento: 'pendente'
            }),
          });
          
          if (response.ok) {
            // Adicionar à lista local
            const novoMedicamento: PrescricaoMedicamento = {
              id: Date.now(), // Temporário até obter o ID real
              id_medicamento: medToAdd.id,
              quantidade: 1,
              nome_medicamento: medToAdd.nome,
              dosagem: medToAdd.dosagem
            };
            
            setSelectedMedications([...selectedMedications, novoMedicamento]);
            
            // Selecionar próximo medicamento disponível
            const nextAvailableMed = availableMedications.find(
              med => med.id !== medicationToAdd && !selectedMedications.some(selected => selected.id_medicamento === med.id)
            );
            
            setMedicationToAdd(nextAvailableMed?.id || null);
          } else {
            const data = await response.json();
            setError(data.error || 'Erro ao adicionar medicamento');
          }
        }
      } catch (error) {
        setError('Erro ao conectar ao backend');
        console.error('Erro ao conectar ao backend:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleQuantityChange = async (id: number, quantidade: number) => {
    setIsLoading(true);
    try {
      // Atualizar quantidade no backend
      const response = await fetch(`${API_BASE_URL}/prescricao_medicamento/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          quantidade
        }),
      });
      
      if (response.ok) {
        // Atualizar estado local
        setSelectedMedications(selectedMedications.map(med => 
          med.id === id ? { ...med, quantidade } : med
        ));
      } else {
        const data = await response.json();
        setError(data.error || 'Erro ao atualizar quantidade');
      }
    } catch (error) {
      setError('Erro ao conectar ao backend');
      console.error('Erro ao conectar ao backend:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMedication = async (id: number) => {
    setIsLoading(true);
    try {
      // Remover do backend
      const response = await fetch(`${API_BASE_URL}/prescricao_medicamento/delete?id=${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        // Remover do estado local
        setSelectedMedications(selectedMedications.filter(med => med.id !== id));
      } else {
        const data = await response.json();
        setError(data.error || 'Erro ao remover medicamento');
      }
    } catch (error) {
      setError('Erro ao conectar ao backend');
      console.error('Erro ao conectar ao backend:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // As alterações já foram salvas individualmente durante as operações
      // Esta função apenas fecha o modal
      setSelectedPrescricao(null);
      setSelectedPatientName(null);
      fetchPrescricoesOnHold(); // Atualizar a lista
    } catch (error) {
      setError('Erro ao conectar ao backend');
      console.error('Erro ao conectar ao backend:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (prescricaoId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      // ID do farmacêutico deve vir do contexto de autenticação
      const idFarmaceutico = 1; // Temporário para exemplo
      
      const response = await fetch(`${API_BASE_URL}/prescricao_aceita/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id_prescricao_on_hold: prescricaoId,
          id_farmaceutico: idFarmaceutico,
        }),
      });
      
      if (response.ok) {
        // Atualizar a lista após aprovação
        fetchPrescricoesOnHold();
      } else {
        const data = await response.json();
        setError(data.error || 'Erro ao aprovar prescrição');
      }
    } catch (error) {
      setError('Erro ao conectar ao backend');
      console.error('Erro ao conectar ao backend:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <nav><Navbar /></nav>
      <PageContent>
        <PageHeader>
          <h1>Prescrições pendentes</h1>
        </PageHeader>
        
        {isLoading && !selectedPrescricao && <LoadingMessage>Carregando prescrições...</LoadingMessage>}
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <section className="prescricoes">
          {(prescricoesOnHold.length === 0 || !prescricoesOnHold.some(p => p.nome_paciente)) && !isLoading && 
            <NoPrescritionMessage>Não há prescrições para serem triadas no momento</NoPrescritionMessage>
          }
          
          {prescricoesOnHold.length > 0 && prescricoesOnHold.filter(p => p.nome_paciente).map((prescricao) => (
            <CardComponent 
              key={prescricao.id}
              paciente={prescricao.nome_paciente || `Paciente ${prescricao.id_paciente}`}
              id={prescricao.hc_paciente || `HC${prescricao.id}`}
              medico={prescricao.nome_medico || `Médico ${prescricao.id_medico}`}
              data={new Date(prescricao.data_prescricao).toLocaleDateString()}
              horario={new Date(prescricao.data_prescricao).toLocaleTimeString()}
              onEdit={() => handleEditClick(prescricao.id, prescricao.nome_paciente || `Paciente ${prescricao.id_paciente}`)}
              onApprove={() => handleApprove(prescricao.id)}
            />
          ))}
        </section>
        
        <Popup 
          open={selectedPrescricao !== null}
          onClose={() => {
            if (!isLoading) {
              setSelectedPrescricao(null);
              setSelectedPatientName(null);
            }
          }}
          modal
          nested
          contentStyle={{ 
            width: '90%',
            maxWidth: '600px',
            padding: 0,
            border: 'none',
            background: 'transparent'
          }}
          overlayStyle={{
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <PopupContainer>
            <PopupHeader>Editar Medicamentos - {selectedPatientName}</PopupHeader>
            
            {isLoading && <LoadingMessage>Processando...</LoadingMessage>}
            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            <PopupContent>
              {selectedMedications.length === 0 && !isLoading && 
                <NoPrescritionMessage>Nenhum medicamento encontrado nesta prescrição</NoPrescritionMessage>
              }
              
              {selectedMedications.map(medication => (
                <MedicationItem key={medication.id}>
                  <MedicationName>
                    {medication.nome_medicamento || `Medicamento ${medication.id_medicamento}`}
                    {medication.dosagem && <DosageInfo>({medication.dosagem})</DosageInfo>}
                  </MedicationName>
                  <MedicationControls>
                    <QuantityLabel>Quantidade:</QuantityLabel>
                    <QuantityInput 
                      type="number" 
                      min="1" 
                      value={medication.quantidade}
                      onChange={(e) => handleQuantityChange(medication.id, parseInt(e.target.value) || 1)}
                      disabled={isLoading}
                    />
                    <RemoveButton 
                      onClick={() => handleRemoveMedication(medication.id)}
                      disabled={isLoading}
                    >
                      Remover
                    </RemoveButton>
                  </MedicationControls>
                </MedicationItem>
              ))}
              
              {getAvailableMedications().length > 0 && (
                <AddMedicationSection>
                  <MedicationSelector>
                    <select 
                      value={medicationToAdd || ''} 
                      onChange={(e) => setMedicationToAdd(parseInt(e.target.value))}
                      className="medication-select"
                      disabled={isLoading}
                    >
                      <option value="" disabled>Selecione um medicamento</option>
                      {getAvailableMedications().map(med => (
                        <option key={med.id} value={med.id}>
                          {med.nome} ({med.dosagem})
                        </option>
                      ))}
                    </select>
                    <AddMedicationButton 
                      onClick={handleAddMedication}
                      disabled={!medicationToAdd || isLoading}
                    >
                      + Adicionar Medicamento
                    </AddMedicationButton>
                  </MedicationSelector>
                </AddMedicationSection>
              )}
            </PopupContent>
            
            <ButtonGroup>
              <CancelButton 
                onClick={() => {
                  setSelectedPrescricao(null);
                  setSelectedPatientName(null);
                }}
                disabled={isLoading}
              >
                Cancelar
              </CancelButton>
              <SaveButton 
                onClick={handleSave}
                disabled={isLoading}
              >
                Salvar Alterações
              </SaveButton>
            </ButtonGroup>
          </PopupContainer>
        </Popup>
      </PageContent>
      
      <FooterWrapper>
        <Footer />
      </FooterWrapper>
    </PageContainer>
  );
}

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh; /* Ensure full viewport height */
  position: relative; /* For footer positioning */
`;

const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 0 15px;
  margin-top: 70px; /* Added to account for fixed navbar */
  padding-bottom: 80px; /* Add space for footer */
  
  .prescricoes {
    width: 90%;
    max-width: 1200px;
    margin: 1rem 0;
    margin-bottom: 2.5rem;
  }
`;

const PageHeader = styled.div`
  width: 90%;
  max-width: 1200px;
  padding: 0 15px;
  margin: 2rem 0 1rem;
  
  h1 {
    color: #34495E;
    font-size: clamp(24px, 5vw, 36px);
    font-weight: 900;
  }
`;

const CardBox = styled.div`
  background-color: #34495E;
  border: 1px solid #ddd;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 15px;
  width: 100%;
  color: #FFF;
  display: flex;
  flex-direction: column;
  gap: 15px;
  
  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .infos-card-prescricao {
    margin-bottom: 10px;
  }

  .infos-card-prescricao span {
    font-size: clamp(24px, 6vw, 40px);
    font-weight: 900;
    display: block; /* Makes the name appear above the info */
    margin-bottom: 0.5rem;
  }

  .infos-card-prescricao p {
    font-size: clamp(14px, 3vw, 16px);
    font-weight: 400;
    margin: .25rem 0;
  }
  
  .time-display {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .botoes-prescricao {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    
    @media (min-width: 480px) {
      flex-direction: row;
      justify-content: space-around;
    }
    
    @media (min-width: 768px) {
      width: 40%;
    }
  }
`;

interface CardComponentProps {
  paciente: string;
  id: string;
  medico: string;
  data: string;
  horario: string;
  onEdit: () => void;
  onApprove: () => void;
}

const CardComponent: React.FC<CardComponentProps> = ({ 
  paciente, id, medico, data, horario, onEdit, onApprove 
}) => {
  return (
    <CardBox>
      <div className="infos-card-prescricao">
        <span>{paciente}</span>
        <p>ID: {id}</p>
        <p>Médico: {medico}</p>
        <p className="time-display">
          <HiOutlineClock /> {data}, {horario}
        </p>
      </div>
      <div className="botoes-prescricao">
        <ApproveButton onClick={onApprove}>
          Aprovar
        </ApproveButton>
        <EditButton onClick={onEdit}>
          Alterar
        </EditButton>
      </div>
    </CardBox>
  )
}

const ApproveButton = styled.button`
  background-color: #2ECC71;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
  width: 100%;
  
  &:hover {
    background-color: #27ae60;
  }
  
  @media (min-width: 480px) {
    width: 48%;
  }
  
  @media (min-width: 768px) {
    width: 45%;
  }
`;

const EditButton = styled.button`
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
  width: 100%;
  
  &:hover {
    background-color: #c0392b;
  }
  
  @media (min-width: 480px) {
    width: 48%;
  }
  
  @media (min-width: 768px) {
    width: 45%;
  }
`;

const PopupContainer = styled.div`
  background-color: #34495E;
  border-radius: 12px;
  overflow: hidden;
  width: 100%;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
`;

const PopupHeader = styled.h2`
  background-color: #2C3E50;
  color: white;
  margin: 0;
  padding: 16px 20px;
  font-size: clamp(18px, 4vw, 22px);
`;

const PopupContent = styled.div`
  padding: 20px;
  max-height: 60vh;
  overflow-y: auto;
`;

const MedicationItem = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const MedicationName = styled.h3`
  color: #34495E;
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 18px;
  font-weight: 600;
`;

const MedicationControls = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
`;

const QuantityLabel = styled.label`
  color: #34495E;
  font-size: 14px;
  font-weight: 500;
`;

const QuantityInput = styled.input`
  width: 60px;
  padding: 6px;
  border: none;
  border-radius: 4px;
`;

const RemoveButton = styled.button`
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  margin-left: auto;
  cursor: pointer;
  
  &:hover {
    background-color: #c0392b;
  }
`;

const AddMedicationSection = styled.div`
  margin-top: 16px;
`;

const MedicationSelector = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  
  .medication-select {
    width: 100%;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ddd;
    font-size: 14px;
    color: #34495E;
  }
`;

const AddMedicationButton = styled.button`
  background-color: #2ECC71;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px;
  width: 100%;
  cursor: pointer;
  font-weight: 600;
  margin-top: 10px;
  
  &:hover {
    background-color: #27ae60;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 15px 20px;
  background-color: #2C3E50;
  gap: 10px;
`;

const CancelButton = styled.button`
  background-color: #95a5a6;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  cursor: pointer;
  font-weight: 600;
  
  &:hover {
    background-color: #7f8c8d;
  }
`;

const SaveButton = styled.button`
  background-color: #2ECC71;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  font-weight: 600;
  
  &:hover {
    background-color: #27ae60;
  }
`;

const FooterWrapper = styled.div`
  width: 100%;
  margin-top: auto; /* Push to bottom if content is short */
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
`;

const DosageInfo = styled.span`
  font-size: 14px;
  font-weight: normal;
  margin-left: 5px;
  color: #7f8c8d;
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
  margin: 10px 0;
`;

const NoPrescritionMessage = styled.div`
  text-align: center;
  padding: 30px 15px;
  color: #7f8c8d;
  background-color: #f8f9fa;
  border-radius: 10px;
  font-weight: 500;
`;

export default Prescricoes;
