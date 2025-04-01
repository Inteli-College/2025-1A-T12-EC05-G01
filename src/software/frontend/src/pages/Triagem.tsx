import styled from 'styled-components';
import { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/sidebar/Navbar';
import API_BASE_URL from '../config/api';
import axios from 'axios';

interface Medicamento {
  id_medicamento?: number;
  medicamento: string;
  quantidade: number;
}

interface Fita {
  id: string;
  nome_paciente: string;
  hc_paciente: string;
  nome_medico: string;
  dateTime: string;
  medicamentos: Medicamento[];
}

const Prescricoes = () => {
  const [fitas, setFitas] = useState<Fita[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [localQuantities, setLocalQuantities] = useState<{[key: string]: number}>({});
  const [newMedications, setNewMedications] = useState<{[key: string]: string}>({});
  const [newMedicationQuantities, setNewMedicationQuantities] = useState<{[key: string]: number}>({});
  const [availableMeds, setAvailableMeds] = useState<MedicationData[]>([]);

  const handleQuantityChange = (fitaId: string, medId: number, quantidade: number) => {
    setLocalQuantities(prev => ({
      ...prev,
      [`${fitaId}-${medId}`]: quantidade
    }));
  };
  
  const handleRemoveMedication = async (fitaId: string, medId: number) => {  
    try {
      const response = await fetch(`${API_BASE_URL}/prescricao_medicamento/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: medId,
          status_medicamento: "dispensado"
        })
      });
      
      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Erro ao remover medicamento');
        
        const updatedFitas = await LerFitas();
        setFitas(updatedFitas || []);
      }

      window.location.reload();
    } catch {
      setError('Erro ao conectar ao backend');
      
      const updatedFitas = await LerFitas();
      setFitas(updatedFitas || []);
    }
  };

  const handleAddMedication = async (fitaId: string) => {
    const newMedicationId = newMedications[fitaId];
    const newMedicationQuantity = newMedicationQuantities[fitaId] || 1;
  
    const selectedMedication = availableMeds.find(
      med => med.id.toString() === newMedicationId
    );
  
    if (!selectedMedication) {
      setError('Medicamento não encontrado');
      return;
    }
  
    try {
      const medicationData = {
        id_prescricao_on_hold: fitaId,
        id_medicamento: selectedMedication.id,
        quantidade: newMedicationQuantity,
        status_medicamento: "pendente"
      };
  
      const response = await axios.post(
        `${API_BASE_URL}/prescricao_medicamento/create`, 
        medicationData
      );
  
      setFitas(prevFitas => 
        prevFitas.map(fita => {
          if (fita.id_prescricao === fitaId) {
            const newMedication: Medicamento = {
              id_medicamento: selectedMedication.id,
              medicamento: selectedMedication.nome,
              quantidade: newMedicationQuantity
            };
            return {
              ...fita,
              medicamentos: [...fita.medicamentos, newMedication]
            };
          }
          return fita;
        })
      );
  
      setNewMedications(prev => ({...prev, [fitaId]: ''}));
      setNewMedicationQuantities(prev => ({...prev, [fitaId]: 1}));
      setError(null);

      window.location.reload();
    } catch (error) {
      console.error('Error adding medication:', error);
      setError('Erro ao adicionar medicamento');
    }
  };

  const handleNewMedicationQuantityChange = (fitaId: string, quantity: number) => {
    setNewMedicationQuantities(prev => ({
      ...prev,
      [fitaId]: quantity
    }));
  };

  const handleMedicationChange = (fitaId: string, medicationId: number) => {
    setNewMedications(prev => ({
      ...prev,
      [fitaId]: medicationId
    }));
  };

  const handleSave = async (fitaId: string) => {
    try {
      setLoading(true);

      const idFarmaceutico = 1;
      const res = await fetch(`${API_BASE_URL}/prescricao_aceita/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id_prescricao_on_hold: fitaId,
          id_farmaceutico: idFarmaceutico,
          status_prescricao: 'aguardando_separacao'
        }),
      });
  
      const data = await res.json();
      const id_prescricao_aceita = data.id;

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || 'Erro ao criar registro de prescrição aceita');
        return;
      }
    
      const fitaToUpdate = fitas.find(fita => fita.id_prescricao === fitaId);
      if (!fitaToUpdate) {
        setError('Prescrição não encontrada');
        return;
      }
  
      const medicationUpdatePromises = fitaToUpdate.medicamentos.map(async (med) => {
        const quantidade = localQuantities[`${fitaId}-${med.id_medicamento}`] ?? med.quantidade;
        
        const response = await fetch(`${API_BASE_URL}/prescricao_medicamento/update`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: med.id_medicamento,
            medicamento: med.medicamento,
            status_medicamento: "aprovado",
            id_prescricao_aceita: id_prescricao_aceita,
            quantidade
          }),
        });
  
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || `Erro ao atualizar medicamento ${med.medicamento}`);
        }
  
        return response;
      });
  
      await Promise.all(medicationUpdatePromises);
  
      window.location.reload();
  
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao conectar ao backend');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [fitasData, medicationsResponse] = await Promise.all([
          LerFitas(),
          axios.get(`${API_BASE_URL}/medicamento/read-all`)
        ]);
  
        setFitas(fitasData || []);
        
        const medications = medicationsResponse.data.medicamentos || [];
        
        if (Array.isArray(medications)) {
          setAvailableMeds(medications);
        } else {
          console.error('Invalid medications data:', medications);
          setError('Erro ao carregar medicamentos');
        }
      } catch (err) {
        const errorMessage = err instanceof Error 
          ? err.message 
          : "Erro ao carregar dados";
        
        console.error('Error fetching data:', err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);

  return (
    <PageContainer>
      <nav><Navbar /></nav>
      <PageContent>
        <PageHeader>
          <h1>Triagem de Prescrições</h1>
        </PageHeader>
        
        {loading && <LoadingMessage>Carregando prescrições...</LoadingMessage>}
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <section className="prescricoes">
          {fitas.length === 0 && !loading && 
            <NoPrescritionMessage>Não há prescrições para serem triadas no momento</NoPrescritionMessage>
          }
          
          {fitas.map((fita) => (
            <FitaBox key={fita.id_prescricao}>
              <FitaComponent 
                paciente={fita.nome_paciente}
                hc={fita.hc_paciente}
                medico={fita.nome_medico}
                data={fita.dateTime}
              />
              
              {fita.medicamentos.length === 0 ? (
                <NoPrescritionMessage>Nenhum medicamento encontrado nesta prescrição</NoPrescritionMessage>
              ) : (
                <MedicationList>
                  {fita.medicamentos.map((med) => (
                    <MedicationItem key={med.id_medicamento}>
                      <MedicationName>
                        {med.medicamento}
                      </MedicationName>
                      <MedicationControls>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '220px', flexShrink: 0 }}>
                          <QuantityLabel>Quantidade:</QuantityLabel>
                          <QuantityInput 
                            type="number" 
                            min="1" 
                            value={
                              localQuantities[`${fita.id_prescricao}-${med.id_medicamento}`] ?? med.quantidade
                            }
                            onChange={(e) => handleQuantityChange(
                              fita.id_prescricao, 
                              med.id_medicamento!, 
                              parseInt(e.target.value)
                            )}
                            disabled={loading}
                          />
                        </div>
                        <RemoveButton 
                          onClick={() => handleRemoveMedication(fita.id_prescricao, med.id_medicamento!)}
                          disabled={loading}
                        >
                          Remover
                        </RemoveButton> 
                      </MedicationControls>
                    </MedicationItem>
                  ))}
                </MedicationList>
              )}
              
              <AddMedicationSection>
                <MedicationSelector>
                <MedicationSelect
                  value={newMedications[fita.id_prescricao] || ''}
                  onChange={(e) => 
                    handleMedicationChange(
                      fita.id_prescricao, 
                      e.target.value
                    )
                  }
                  required
                >
                  <option value="">Selecione o Medicamento</option>
                  {availableMeds.map((med) => (
                    <option key={med.id} value={med.id.toString()}>
                      {med.nome} - {med.dosagem}
                    </option>
                  ))}
                </MedicationSelect>
                <AddMed>
                <QuantityControl>
                    <QuantityLabel>Quantidade:</QuantityLabel>
                    <QuantityInput 
                      type="number" 
                      min="1" 
                      value={newMedicationQuantities[fita.id_prescricao] || 1}
                      onChange={(e) => handleNewMedicationQuantityChange(
                        fita.id_prescricao, 
                        parseInt(e.target.value)
                      )}
                      disabled={loading}
                    />
                  </QuantityControl>
                  <AddMedicationButton 
                    onClick={() => handleAddMedication(fita.id_prescricao)}
                    disabled={loading}
                  >
                    Adicionar Medicamento
                  </AddMedicationButton>
                </AddMed>
                  
                </MedicationSelector>
              </AddMedicationSection>
              
              <BotoesFita>
                <SaveButton 
                  onClick={() => handleSave(fita.id_prescricao)}
                  disabled={loading}
                >
                  Salvar e Aprovar
                </SaveButton>
              </BotoesFita>
            </FitaBox>
          ))}
        </section>
      </PageContent>
      
      <FooterWrapper>
        <Footer />
      </FooterWrapper>
    </PageContainer>
  );
}

async function LerFitas(){
  try {
    const res = await fetch("http://127.0.0.1:3000/fitas/aguardando-triagem", {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });
    const data = await res.json();
    if (res.ok) {
      return data.fitas || [];
    } else {
      console.error("Erro ao ler: " + (data.error || res.statusText));
      return [];
    }
  } catch (error) {
    console.error("Erro ao ler:", error);
    return [];
  }
}

const AddMed = styled.div `
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 50px;
`;

const MedicationSelect = styled.select`
  flex: 1;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
  background-color: white;
  color: #333;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;


const MedicationList = styled.div`
  width: '90%';
  maxWidth: '600px';
  maxHeight: '80vh';
  padding: 0;
  border: 'none';
  background: 'transparent';
  borderRadius: '12px';
`;

const BotoesFita = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 12px;
  align-items: center;
  gap: 10px;
`;

const FitaBox = styled.div`
  width: 900px;
  background-color: #2C3E50;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding-top: 20px;
  padding-bottom: 40px;
  border-radius: 15px;
  margin-bottom: 15px;

  .topo-fita {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
    color: white;
    
    @media (min-width: 576px) {
      width: 100%;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }

  .topo-fita h3 {
    font-size: clamp(18px, 4vw, 24px);
    font-weight: 550;
    margin: 10px;
  }

  .topo-fita p {
    margin: 8px;
    font-size: clamp(14px, 3vw, 16px);
  }

  .botoes-controle {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    
    @media (min-width: 576px) {
      flex-direction: row;
      justify-content: flex-end;
      width: auto;
    }
  }
`;

interface FitaComponentProps {
  paciente: string;
  id: string;
  medico: string;
  data: string;
  horario: string;
  onEdit: () => void;
  onApprove: () => void;
}

const FitaComponent = ({ paciente, hc, medico, data }: FitaComponentProps) => {
  return (
    <>
      <EscritasTopo>
        <div className='topo-fita'>
          <div className="dados">
            <h3>{paciente}</h3>
            <p>HC: {hc} | Médico: {medico}</p>
            <p>Data: {data} </p>
          </div>
        </div>
      </EscritasTopo>
    </>
  );

};

const EscritasTopo = styled.div`
  justify-content: left;
  width: 700px;
  margin: 8px;
`;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  min-height: 100vh; /* Ensure full viewport height */
  position: relative; /* For footer positioning */
`;

const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 0 15px;
  margin-top: 70px;
  padding-bottom: 80px;
  
  .prescricoes {
    display: flex;
    justify-content: center;
    align-items: center;
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
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const MedicationItem = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 18px;
  margin-bottom: 16px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  width: 700px;
  height: 120px;
  
  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const MedicationName = styled.h3`
  color: #34495E;
  margin-top: 0;
  margin-bottom: 12px;
  font-size: 18px;
  font-weight: 600;
`;

const MedicationControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
`;

const QuantityLabel = styled.label`
  color: #34495E;
  font-size: 15px;
  font-weight: 500;
  min-width: 85px;
`;

const QuantityInput = styled.input`
  width: 60px;
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 15px;
  text-align: center;
  
  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const RemoveButton = styled.button`
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 16px;
  margin-left: auto;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #c0392b;
  }
  
  &:active {
    transform: translateY(1px);
  }
  
  &:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
  }
`;

const AddMedicationSection = styled.div`
  margin-top: 8px;
  margin-bottom: 8px;
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border: 1px dashed #bdc3c7;
  width: 700px;
  height: 150px;
`;

const MedicationSelector = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  
  .medication-select {
    width: 100%;
    padding: 14px;
    border-radius: 5px;
    border: 1px solid #ddd;
    font-size: 16px;
    color: #34495E;
    background-color: white;
    
    &:focus {
      outline: none;
      border-color: #3498db;
      box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
    }
  }
`;

const AddMedicationButton = styled.button`
  background-color: #2ECC71;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 14px;
  width: 100%;
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
  margin-top: 3px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #27ae60;
  }
  
  &:active {
    transform: translateY(1px);
  }
  
  &:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
  }
`;

const SaveButton = styled.button`
  background-color: #2ECC71;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 14px 28px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
  flex: 1;
  
  &:hover {
    background-color: #27ae60;
  }
  
  &:active {
    transform: translateY(1px);
  }
  
  &:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
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
