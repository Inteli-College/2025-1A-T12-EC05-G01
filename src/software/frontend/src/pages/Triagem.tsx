import styled from 'styled-components';
import { useState } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/sidebar/Navbar';
import { HiOutlineClock } from "react-icons/hi2";
import Popup from 'reactjs-popup';
//import axios from 'axios';

const availableMedications = [
  { id: 1, name: "Paracetamol 750mg", dosage: "750mg" },
  { id: 2, name: "Dipirona 1g", dosage: "1g" },
  { id: 3, name: "Loratadina 10mg", dosage: "10mg" },
  { id: 4, name: "Sertralina 50mg", dosage: "50mg" },
  { id: 5, name: "Miosan 10mg", dosage: "10mg" }
];

const Prescricoes = () => {
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [selectedMedications, setSelectedMedications] = useState<Array<{id: number, name: string, quantity: number}>>([]);
  const [medicationToAdd, setMedicationToAdd] = useState<number | null>(null);

  const handleEditClick = (patientName: string) => {
    setSelectedPatient(patientName);
    setSelectedMedications([
      { id: 1, name: "Paracetamol 750mg", quantity: 1 },
      { id: 3, name: "Loratadina 10mg", quantity: 2 }
    ]);
    
    const selectedIds = [1, 3];
    const availableMed = availableMedications.find(med => !selectedIds.includes(med.id));
    if (availableMed) {
      setMedicationToAdd(availableMed.id);
    }
  };

  const getAvailableMedications = () => {
    const selectedIds = selectedMedications.map(med => med.id);
    return availableMedications.filter(med => !selectedIds.includes(med.id));
  };

  const handleAddMedication = () => {
    if (medicationToAdd) {
      const medToAdd = availableMedications.find(med => med.id === medicationToAdd);
      if (medToAdd) {
        setSelectedMedications([...selectedMedications, {
          id: medToAdd.id,
          name: medToAdd.name,
          quantity: 1
        }]);
        
        const nextAvailableMed = availableMedications.find(
          med => med.id !== medicationToAdd && !selectedMedications.some(selected => selected.id === med.id)
        );
        
        setMedicationToAdd(nextAvailableMed?.id || null);
      }
    }
  };

  const handleQuantityChange = (id: number, quantity: number) => {
    setSelectedMedications(selectedMedications.map(med => 
      med.id === id ? { ...med, quantity } : med
    ));
  };

  const handleRemoveMedication = (id: number) => {
    setSelectedMedications(selectedMedications.filter(med => med.id !== id));
  };

  const handleSave = () => {
    console.log("Saving medications for", selectedPatient, selectedMedications);
    setSelectedPatient(null);
  };

  return (
    <PageContainer>
      <nav><Navbar /></nav>
      <PageContent>
        <PageHeader>
          <h1>Triagem</h1>
        </PageHeader>
        
        <section className="prescricoes">
          <CardComponent 
            paciente="Ana Maria" 
            id="HC123456" 
            medico="Mariana Oliveira" 
            data="24/02/2025" 
            horario="16:40:31" 
            onEdit={() => handleEditClick("Ana Maria")}
          />
          <CardComponent 
            paciente="Amanda Costa" 
            id="HC654321" 
            medico="Sergio Melo" 
            data="24/02/2025" 
            horario="16:32:45" 
            onEdit={() => handleEditClick("Amanda Costa")}
          />
          <CardComponent 
            paciente="Anny Maia" 
            id="HC817680" 
            medico="Sergio Melo" 
            data="24/02/2025" 
            horario="16:20:17" 
            onEdit={() => handleEditClick("Anny Maia")}
          />
        </section>
        
        <Popup 
          open={selectedPatient !== null}
          onClose={() => setSelectedPatient(null)}
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
            <PopupHeader>Editar Medicamentos - {selectedPatient}</PopupHeader>
            <PopupContent>
              {selectedMedications.map(medication => (
                <MedicationItem key={medication.id}>
                  <MedicationName>{medication.name}</MedicationName>
                  <MedicationControls>
                    <QuantityLabel>Quantidade:</QuantityLabel>
                    <QuantityInput 
                      type="number" 
                      min="1" 
                      value={medication.quantity}
                      onChange={(e) => handleQuantityChange(medication.id, parseInt(e.target.value) || 1)}
                    />
                    <RemoveButton onClick={() => handleRemoveMedication(medication.id)}>
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
                    >
                      <option value="" disabled>Selecione um medicamento</option>
                      {getAvailableMedications().map(med => (
                        <option key={med.id} value={med.id}>
                          {med.name} ({med.dosage})
                        </option>
                      ))}
                    </select>
                    <AddMedicationButton 
                      onClick={handleAddMedication}
                      disabled={!medicationToAdd}
                    >
                      + Adicionar Medicamento
                    </AddMedicationButton>
                  </MedicationSelector>
                </AddMedicationSection>
              )}
            </PopupContent>
            
            <ButtonGroup>
              <CancelButton onClick={() => setSelectedPatient(null)}>
                Cancelar
              </CancelButton>
              <SaveButton onClick={handleSave}>
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
}

const CardComponent: React.FC<CardComponentProps> = ({ 
  paciente, id, medico, data, horario, onEdit 
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
        <ApproveButton onClick={() => window.alert('Prescrição aprovada')}>
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

export default Prescricoes;
