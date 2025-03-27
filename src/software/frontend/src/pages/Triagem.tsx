import styled from 'styled-components';
import { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/sidebar/Navbar';
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
  const [medicationsCache, setMedicationsCache] = useState<{[key: number]: Medication}>({});
  const [prescriptionMedications, setPrescriptionMedications] = useState<{
    [prescriptionId: number]: Array<PrescricaoMedicamento>
  }>({});

  useEffect(() => {
    // First fetch the medications to populate the cache
    fetchAvailableMedications().then(() => {
      // Then fetch the prescriptions which will use the medication cache
      fetchPrescricoesOnHold();
    });
  }, []);

  const fetchPrescricoesOnHold = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/prescricao_on_hold/read-all`, { method: 'GET' });
      const data = await response.json();
      
      if (response.ok) {
        // Certifica-se de que estamos acessando o array correto
        const prescricoesData = data.PrescricaoOnHold || data.prescricoes_on_hold || [];
        
        if (prescricoesData.length === 0) {
          setPrescricoesOnHold([]);
          setIsLoading(false);
          return;
        }
        
        // Para cada prescrição, buscar dados do paciente e médico
        const prescricoesDetalhadas = await Promise.all(prescricoesData.map(async (prescricao: PrescricaoOnHold) => {
          try {
            // Buscar dados do paciente
            const pacienteResponse = await fetch(`${API_BASE_URL}/paciente/read-id`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: prescricao.id_paciente })
            });
            
            let pacienteNome = '';
            let pacienteHC = '';
            
            if (pacienteResponse.ok) {
              const pacienteData = await pacienteResponse.json();
              
              // Handle the case where Paciente is a string (improperly formatted JSON)
              if (pacienteData.Paciente && typeof pacienteData.Paciente === 'string') {
                try {
                  // Try to parse the string as JSON by replacing single quotes with double quotes
                  const pacienteString = pacienteData.Paciente.replace(/'/g, '"');
                  const pacienteObj = JSON.parse(pacienteString);
                  
                  pacienteNome = pacienteObj.nome || `Paciente ${prescricao.id_paciente}`;
                  pacienteHC = pacienteObj.hc || `HC${prescricao.id_paciente}`;
                } catch {
                  // Use regex to extract values if JSON parsing fails
                  const nameMatch = pacienteData.Paciente.match(/'nome':\s*'([^']+)'/);
                  const hcMatch = pacienteData.Paciente.match(/'hc':\s*'([^']+)'/);
                  
                  pacienteNome = nameMatch ? nameMatch[1] : `Paciente ${prescricao.id_paciente}`;
                  pacienteHC = hcMatch ? hcMatch[1] : `HC${prescricao.id_paciente}`;
                }
              } else if (pacienteData.paciente) {
                pacienteNome = pacienteData.paciente.nome || `Paciente ${prescricao.id_paciente}`;
                pacienteHC = pacienteData.paciente.hc || `HC${prescricao.id_paciente}`;
              } else if (pacienteData.nome) {
                pacienteNome = pacienteData.nome;
                pacienteHC = pacienteData.hc || `HC${prescricao.id_paciente}`;
              } else {
                pacienteNome = `Paciente ${prescricao.id_paciente}`;
                pacienteHC = `HC${prescricao.id_paciente}`;
              }
            } else {
              // Failed to fetch patient data
            }
            
            // Buscar dados do médico
            const medicoResponse = await fetch(`${API_BASE_URL}/medico/read-id`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: prescricao.id_medico })
            });
            
            let medicoNome = '';
            
            if (medicoResponse.ok) {
              const medicoData = await medicoResponse.json();
              
              // Handle the case where Medico might also be a string
              if (medicoData.Medico && typeof medicoData.Medico === 'string') {
                try {
                  const medicoString = medicoData.Medico.replace(/'/g, '"');
                  const medicoObj = JSON.parse(medicoString);
                  medicoNome = medicoObj.nome || `Médico ${prescricao.id_medico}`;
                } catch {
                  // Use regex to extract name if JSON parsing fails
                  const nameMatch = medicoData.Medico.match(/'nome':\s*'([^']+)'/);
                  medicoNome = nameMatch ? nameMatch[1] : `Médico ${prescricao.id_medico}`;
                }
              } else if (medicoData.Medico) {
                medicoNome = medicoData.Medico.nome || `Médico ${prescricao.id_medico}`;
              } else if (medicoData.medico) {
                medicoNome = medicoData.medico.nome || `Médico ${prescricao.id_medico}`;
              } else if (medicoData.nome) {
                medicoNome = medicoData.nome;
              } else {
                medicoNome = `Médico ${prescricao.id_medico}`;
              }
            } else {
              // Failed to fetch doctor data
            }

            // Additionally fetch medications for each prescription
            await fetchMedicationsForPrescription(prescricao.id);
            
            return {
              ...prescricao,
              nome_paciente: pacienteNome,
              hc_paciente: pacienteHC,
              nome_medico: medicoNome
            };
          } catch {
            return {
              ...prescricao,
              nome_paciente: `Paciente ${prescricao.id_paciente}`,
              hc_paciente: `HC${prescricao.id_paciente}`,
              nome_medico: `Médico ${prescricao.id_medico}`
            };
          }
        }));
        
        setPrescricoesOnHold(prescricoesDetalhadas);
      } else {
        setError(data.error || 'Erro ao buscar prescrições');
      }
    } catch {
      setError('Erro ao conectar ao backend');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to parse medication data from various response formats
  interface MedicationResponse {
    medicamento?: string | Medication;
    Medicamento?: Medication;
    id?: number;
    nome?: string;
    dosagem?: string;
  }

  const parseMedicationData = (responseData: MedicationResponse): Medication | null => {
    try {
      // Case 1: When response has medicamento as a string representation
      if (responseData.medicamento && typeof responseData.medicamento === 'string') {
        // Clean up the string representation (replace single quotes with double quotes)
        const cleanedString = responseData.medicamento.replace(/'/g, '"');
        try {
          // Parse the string to JSON
          return JSON.parse(cleanedString);
        } catch {
          // Fallback to regex extraction if JSON parsing fails
          const idMatch = responseData.medicamento.match(/'id':\s*(\d+)/);
          const nameMatch = responseData.medicamento.match(/'nome':\s*'([^']+)'/);
          const dosageMatch = responseData.medicamento.match(/'dosagem':\s*'([^']+)'/);
          
          if (nameMatch) {
            return {
              id: idMatch ? parseInt(idMatch[1]) : 0,
              nome: nameMatch[1],
              dosagem: dosageMatch ? dosageMatch[1] : 'Dosagem não disponível'
            };
          }
        }
      }
      
      // Case 2: When response has medicamento or Medicamento as an object
      if (responseData.medicamento && typeof responseData.medicamento === 'object') {
        return responseData.medicamento;
      }
      
      if (responseData.Medicamento && typeof responseData.Medicamento === 'object') {
        return responseData.Medicamento;
      }
      
      // Case 3: When the response is the medication object itself
      if (responseData.id && responseData.nome) {
        return {
          id: responseData.id || 0, // Default to 0 if id is undefined
          nome: responseData.nome || 'Nome não disponível',
          dosagem: responseData.dosagem || 'Dosagem não disponível',
        };
      }
      
      return null;
    } catch {
      return null;
    }
  };

  // New function to fetch medications for a specific prescription with enhanced debugging
  const fetchMedicationsForPrescription = async (prescricaoId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/prescricao_medicamento/read-all`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_prescricao_on_hold: prescricaoId }),
      });
      
      if (!response.ok) {
        return;
      }
      
      const data = await response.json();
      
      // Extract the medications array more carefully
      let medicamentos = [];
      if (data.prescricoes_medicamento) {
        medicamentos = data.prescricoes_medicamento;
      } else if (data.PrescricoesMedicamento) {
        medicamentos = data.PrescricoesMedicamento;
      } else if (data.prescricao_medicamento) {
        medicamentos = data.prescricao_medicamento;
      } else if (Array.isArray(data)) {
        medicamentos = data;
      }
      
      if (!medicamentos || medicamentos.length === 0) {
        setPrescriptionMedications(prev => ({...prev, [prescricaoId]: []}));
        return;
      }
      
      // Process each medication in a sequential loop for better debugging
      const medicamentosDetalhados: Array<PrescricaoMedicamento & { nome_medicamento?: string; dosagem?: string }> = [];
      
      for (const med of medicamentos) {
        // First, try to get medication details from available medications
        let medData = availableMedications.find(m => m.id === med.id_medicamento);
        
        // If not found in availableMedications, check the cache
        if (!medData) {
          medData = medicationsCache[med.id_medicamento];
        }
        
        // If still not found, fetch from API
        if (!medData) {
          try {
            const medResponse = await fetch(`${API_BASE_URL}/medicamento/read-id`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: med.id_medicamento }),
            });
            
            if (medResponse.ok) {
              const responseData = await medResponse.json();
              
              // Parse medication data using our helper function
              const parsedMedData = parseMedicationData(responseData);
              
              if (parsedMedData) {
                medData = parsedMedData;
                
                // Update cache if we found valid data
                if (medData.id || medData.nome) {
                  // Create a new cache object to ensure state update
                  const newCache = {
                    ...medicationsCache,
                    [med.id_medicamento]: medData
                  };
                  setMedicationsCache(newCache);
                }
              }
            }
          } catch {
            // Error handling without logs
          }
        }
        
        // Extract name and dosage with detailed logging
        let medicationName = 'Medicamento não identificado';
        let dosagem = 'Dosagem não disponível';
        
        if (medData) {
          medicationName = medData.nome || `Medicamento ${med.id_medicamento}`;
          dosagem = medData.dosagem || 'Dosagem não disponível';
        }
        
        // Add processed medication to results
        medicamentosDetalhados.push({
          ...med,
          nome_medicamento: medicationName,
          dosagem: dosagem
        });
      }
      
      // Force a re-render with new detailed medications
      setPrescriptionMedications(prev => {
        const updated = {...prev};
        updated[prescricaoId] = medicamentosDetalhados;
        return updated;
      });
      
    } catch {
      // Error handling without logs
    }
  };

  const fetchAvailableMedications = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/medicamento/read-all`, { method: 'GET' });
      const data = await response.json();
      
      if (response.ok) {
        // Try different possible response formats
        let medications = [];
        if (data.medicamentos) {
          medications = data.medicamentos;
        } else if (data.Medicamentos) {
          medications = data.Medicamentos;
        } else if (Array.isArray(data)) {
          medications = data;
        }
        
        // Process each medication to ensure proper format
        const processedMedications: Medication[] = medications.map((med: string | MedicationResponse) => {
          // If medication is a string, parse it
          if (typeof med === 'string') {
            try {
              return JSON.parse(med.replace(/'/g, '"')) as Medication;
            } catch {
              return null;
            }
          }
          // If medication has a string medicamento property, parse that
          else if (med.medicamento && typeof med.medicamento === 'string') {
            const parsedMed: Medication | null = parseMedicationData(med as MedicationResponse);
            return parsedMed;
          }
          return med as Medication;
        }).filter((med): med is Medication => med !== null);
        
        setAvailableMedications(processedMedications);
        
        // Create a comprehensive medication cache
        const cache = {...medicationsCache};
        processedMedications.forEach((med: Medication) => {
          if (med && med.id) {
            cache[med.id] = med;
          }
        });
        setMedicationsCache(cache);
        
        // Force re-fetch of medications for any existing prescriptions
        for (const prescricaoId of Object.keys(prescriptionMedications)) {
          fetchMedicationsForPrescription(Number(prescricaoId));
        }
      } else {
        // Error handling
      }
    } catch {
      // Error handling
    }
  };


  const handleEditClick = async (prescricaoId: number, patientName: string) => {
    setIsLoading(true);
    setError(null);
    setSelectedMedications([]); // Limpa medicamentos selecionados anteriormente
    
    try {
      // Buscar medicamentos associados a esta prescrição
      const response = await fetch(`${API_BASE_URL}/prescricao_medicamento/read-all`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_prescricao_on_hold: prescricaoId }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao buscar detalhes da prescrição');
      }
      
      const data = await response.json();
      
      // Try different possible response formats
      const medicamentos = data.prescricoes_medicamento || data.PrescricoesMedicamento || data.prescricao_medicamento || [];
      
      if (medicamentos.length === 0) {
        setSelectedPrescricao(prescricaoId);
        setSelectedPatientName(patientName);
        setIsLoading(false);
        return;
      }
      
      // Para cada medicamento, buscar detalhes complementares em paralelo
      const medicationPromises = medicamentos.map(async (med: PrescricaoMedicamento) => {
        // Tentar buscar do cache primeiro
        let medData = medicationsCache[med.id_medicamento];
        
        // Se não estiver no cache, buscar da API
        if (!medData) {
          try {
            const medResponse = await fetch(`${API_BASE_URL}/medicamento/read-id`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: med.id_medicamento }),
            });
            
            if (medResponse.ok) {
              const responseData = await medResponse.json();
              
              // Use the helper function to parse medication data
              const parsedMedData = parseMedicationData(responseData);
              
              if (parsedMedData) {
                medData = parsedMedData;
                
                // Atualizar o cache
                if (medData.id || medData.nome) {
                  setMedicationsCache(prev => ({
                    ...prev,
                    [med.id_medicamento]: medData
                  }));
                }
              }
            }
          } catch {
            // Error handling
          }
        }
        
        // Use name and dosage safely with fallbacks
        const medicationName = medData?.nome || `Medicamento ${med.id_medicamento}`;
        const dosagem = medData?.dosagem || 'Dosagem não disponível';
        
        return {
          ...med,
          nome_medicamento: medicationName,
          dosagem: dosagem
        };
      });
      
      const medicamentosDetalhados = await Promise.all(medicationPromises);
      
      setSelectedPrescricao(prescricaoId);
      setSelectedPatientName(patientName);
      setSelectedMedications(medicamentosDetalhados);
      
      // Definir o primeiro medicamento disponível para adição
      if (availableMedications.length > 0) {
        const usedMedicationIds = medicamentosDetalhados.map(med => med.id_medicamento);
        const availableMed = availableMedications.find(med => !usedMedicationIds.includes(med.id));
        setMedicationToAdd(availableMed?.id || null);
      }
    } catch {
      setError(typeof error === 'object' && error !== null && 'message' in error ? (error as Error).message : 'Erro ao conectar ao backend');
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
            const responseData = await response.json();
            
            // Adicionar à lista local com o ID correto do backend
            const novoMedicamento: PrescricaoMedicamento = {
              id: responseData.id || Date.now(), // Usar o ID real ou um temporário
              id_medicamento: medToAdd.id,
              quantidade: 1,
              nome_medicamento: medToAdd.nome,
              dosagem: medToAdd.dosagem
            };
            
            // Atualizar o cache de medicamentos
            if (!medicationsCache[medToAdd.id]) {
              setMedicationsCache(prev => ({
                ...prev,
                [medToAdd.id]: medToAdd
              }));
            }
            
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
      } catch {
        setError('Erro ao conectar ao backend');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleQuantityChange = async (id: number, quantidade: number) => {
    // Não vamos mostrar o indicador de carregamento global para não atrapalhar o usuário
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
      
      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Erro ao atualizar quantidade');
      }
    } catch {
      // Tratamento silencioso para não interromper a experiência do usuário
      // Se houver falha, o estado local ainda refletirá a mudança
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
    } catch {
      setError('Erro ao conectar ao backend');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // As alterações já foram salvas individualmente durante as operações
      // Esta função apenas fecha o modal e atualiza a lista e o cache
      
      // Refresh medication data for this prescription
      if (selectedPrescricao) {
        await fetchMedicationsForPrescription(selectedPrescricao);
      }
      
      // Re-fetch all prescriptions to update the main view
      await fetchPrescricoesOnHold();
      
      // Close the modal
      setSelectedPrescricao(null);
      setSelectedPatientName(null);
    } catch {
      setError('Erro ao conectar ao backend');
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
        // Remove from local state immediately
        setPrescricoesOnHold(prev => prev.filter(p => p.id !== prescricaoId));
        setPrescriptionMedications(prev => {
          const newState = {...prev};
          delete newState[prescricaoId];
          return newState;
        });
      } else {
        const data = await response.json();
        setError(data.error || 'Erro ao aprovar prescrição');
      }
    } catch {
      setError('Erro ao conectar ao backend');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <nav><Navbar /></nav>
      <PageContent>
        <PageHeader>
          <h1>Triagem</h1>
        </PageHeader>
        
        {isLoading && !selectedPrescricao && <LoadingMessage>Carregando prescrições...</LoadingMessage>}
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <section className="prescricoes">
          {prescricoesOnHold.length === 0 && !isLoading && 
            <NoPrescritionMessage>Não há prescrições para serem triadas no momento</NoPrescritionMessage>
          }
          
          {prescricoesOnHold.length > 0 && prescricoesOnHold.map((prescricao) => {
            // Get the medications for this prescription
            const medications = prescriptionMedications[prescricao.id] || [];
            
            return (
              <FitaBox key={prescricao.id}>
                <FitaComponent 
                  paciente={prescricao.nome_paciente || `Paciente ${prescricao.id_paciente}`}
                  id={prescricao.hc_paciente || `HC${prescricao.id}`}
                  medico={prescricao.nome_medico || `Médico ${prescricao.id_medico}`}
                  data={new Date(prescricao.data_prescricao).toLocaleDateString()}
                  horario={new Date(prescricao.data_prescricao).toLocaleTimeString()}
                  onEdit={() => handleEditClick(prescricao.id, prescricao.nome_paciente || `Paciente ${prescricao.id_paciente}`)}
                  onApprove={() => handleApprove(prescricao.id)}
                />
                
                {medications.length > 0 ? (
                  medications.map((med) => {
                    return (
                      <StatusComponent 
                        key={med.id}
                        medicamento={med.nome_medicamento || `Medicamento ${med.id_medicamento}`}
                        dosagem={med.dosagem || 'Dosagem não disponível'}
                        quantidade={med.quantidade}
                        status="pendente"
                      />
                    );
                  })
                ) : (
                  <div style={{ padding: '10px', color: 'white', textAlign: 'center' }}>
                    Carregando medicamentos...
                  </div>
                )}
              </FitaBox>
            );
          })}
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
            maxHeight: '80vh',
            padding: 0,
            border: 'none',
            background: 'transparent',
            borderRadius: '12px'
          }}
          overlayStyle={{
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '10px'
          }}
        >
          <PopupContainer>
            <PopupHeader>Editar Medicamentos - {selectedPatientName}</PopupHeader>
            
            <PopupContent>
              {/* Reservar espaço para mensagens de carregamento/erro com altura fixa */}
              <LoadingContainer isVisible={!!(isLoading || error)}>
                {isLoading && <LoadingMessage>Processando...</LoadingMessage>}
                {error && <ErrorMessage>{error}</ErrorMessage>}
              </LoadingContainer>
              
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '220px', flexShrink: 0 }}>
                      <QuantityLabel>Quantidade:</QuantityLabel>
                      <QuantityInput 
                        type="number" 
                        min="1" 
                        value={medication.quantidade}
                        onChange={(e) => {
                          // Atualizar o estado localmente primeiro para manter a responsividade
                          const newQuantity = parseInt(e.target.value) || 1;
                          setSelectedMedications(selectedMedications.map(med => 
                            med.id === medication.id ? { ...med, quantidade: newQuantity } : med
                          ));
                          
                          // Debounce a chamada para o backend
                          const timer = setTimeout(() => {
                            handleQuantityChange(medication.id, newQuantity);
                          }, 500);
                          
                          return () => clearTimeout(timer);
                        }}
                        disabled={isLoading}
                      />
                    </div>
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

// New component styles based on FilaSeparacao styling
const FitaBox = styled.div`
  width: 100%;
  background-color: #2C3E50;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 1rem;
  border-radius: 15px;
  margin-bottom: 20px;

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
    margin: 0;
  }

  .topo-fita p {
    margin: 0;
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

interface StatusBoxProps {
  status: "pendente" | "separado" | "em separação" | "esperando separação" | string;
}

const StatusBox = styled.div<StatusBoxProps>`
  background-color: white;
  padding: 15px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  text-transform: capitalize;
  color: #333;
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
    color: #333;
  }

  .informacoes p {
    font-size: clamp(14px, 3vw, 16px);
    font-weight: 500;
    margin: 0;
    color: #333;
  }

  .status {
    font-size: clamp(16px, 3.5vw, 20px);
    font-weight: 550;
    margin-top: 10px;
    color: ${(props) =>
      props.status === "separado" ? "#27ae60" :
      props.status === "em separação" ? "#f39c12" :
      props.status === "esperando separação" ? "#d35400" :
      props.status === "pendente" ? "#7B68EE" : "#333"};
    
    @media (min-width: 576px) {
      margin-top: 0;
    }
  }
`;

interface StatusComponentProps {
  medicamento: string;
  dosagem: string;
  quantidade: number;
  status: string;
}

const StatusComponent = ({ medicamento, dosagem, quantidade, status }: StatusComponentProps) => {
  return (
    <StatusBox status={status}>
      <div className="informacoes">
        <span>{medicamento} {dosagem}</span>
        <p>Quantidade: {quantidade} </p>
      </div>
      <div className="status">{status}</div>
    </StatusBox>
  );
};

interface FitaComponentProps {
  paciente: string;
  id: string;
  medico: string;
  data: string;
  horario: string;
  onEdit: () => void;
  onApprove: () => void;
}

const FitaComponent = ({ paciente, id, medico, data, horario, onEdit, onApprove }: FitaComponentProps) => {
  return (
    <>
      <div className='topo-fita'>
        <div className="dados">
          <h3>{paciente}</h3>
          <p>ID: {id} | Médico: {medico}</p>
          <p>Data: {data}, {horario} </p>
          <div className="botoes-controle" style={{ marginTop: '25px', marginBottom: '15px', display: 'flex', gap: '20px' }}>
            <ApproveButton onClick={onApprove}>
              Aprovar
            </ApproveButton>
            <EditButton onClick={onEdit}>
              Alterar
            </EditButton>
          </div>
        </div>
      </div>
    </>
  );
};

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

interface LoadingContainerProps {
  isVisible: boolean;
}

const LoadingContainer = styled.div<LoadingContainerProps>`
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  visibility: ${props => props.isVisible ? 'visible' : 'hidden'};
  opacity: ${props => props.isVisible ? 1 : 0};
  transition: opacity 0.2s ease;
`;

const PopupContent = styled.div`
  padding: 24px;
  max-height: 60vh;
  overflow-y: auto;
  background-color: #f5f7fa;
`;

const MedicationItem = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 18px;
  margin-bottom: 16px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  
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
  
  /* Remover setas do input number */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  /* Para Firefox */
  -moz-appearance: textfield;
  
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
  margin-top: 30px;
  margin-bottom: 15px;
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border: 1px dashed #bdc3c7;
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
  margin-top: 15px;
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

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 28px;
  background-color: #2C3E50;
  gap: 20px;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const CancelButton = styled.button`
  background-color: #95a5a6;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 14px 24px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
  flex: 1;
  
  &:hover {
    background-color: #7f8c8d;
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
