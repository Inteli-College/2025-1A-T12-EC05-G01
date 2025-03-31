import { useState, useEffect } from "react";
import styled from "styled-components";
import API_BASE_URL from "../config/api";

interface Medication {
  id: number; // identificador único local para renderização
  id_medicamento: number | ""; // id do medicamento selecionado
  quantity: string;
}

export default function AdicionarPrescricao() {
  const [step, setStep] = useState(1);

  // Dados do paciente (Passo 1)
  const [pacienteNome, setPacienteNome] = useState("");
  const [leito, setLeito] = useState("");
  const [hc, setHC] = useState("");
  const [pacienteId, setPacienteId] = useState<number | null>(null);

  // Dados da prescrição (Passo 2)
  interface MedicationData {
    id: number;
    nome: string;
    dosagem: string;
  }

  const [availableMeds, setAvailableMeds] = useState<MedicationData[]>([]);
  const [medications, setMedications] = useState<Medication[]>([
    { id: Date.now(), id_medicamento: "", quantity: "" }
  ]);
  const [error, setError] = useState("");

  // Ao avançar para o passo 2, busca os medicamentos disponíveis
  useEffect(() => {
    if (step === 2) {
      fetch(`${API_BASE_URL}/medicamento/read-all`)
        .then((res) => res.json())
        .then((data) => {
          if (data.medicamentos) {
            setAvailableMeds(data.medicamentos);
          }
        })
        .catch((err) => console.error("Erro ao buscar medicamentos:", err));
    }
  }, [step]);

  // Função para criar o paciente
  const handlePatientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/paciente/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: pacienteNome, leito, hc })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erro ao criar paciente");
        return;
      }
      // Assume que a resposta retorne o id do paciente em data.id
      console.log(data.id);
      setPacienteId(data.id);
      setStep(2);
    } catch (err) {
      console.error(err);
      setError("Erro de conexão com o servidor");
    }
  };

  // Função para adicionar uma nova linha de medicamento
  const handleAddMedicationRow = () => {
    setMedications([
      ...medications,
      { id: Date.now(), id_medicamento: "", quantity: "" }
    ]);
  };

  // Atualiza os dados de um medicamento na lista
  const handleMedicationChange = (
    index: number,
    field: "id_medicamento" | "quantity",
    value: string
  ) => {
    const updated = [...medications];
    if (field === "id_medicamento") {
      updated[index].id_medicamento = Number(value);
    } else if (field === "quantity") {
      updated[index].quantity = value;
    }
    setMedications(updated);
  };

  // Função para criar a prescrição e os medicamentos associados
const handlePrescriptionSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    // Obtém os dados dos médicos
    const doctorRes = await fetch(`${API_BASE_URL}/medico/read-all`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    
    if (!doctorRes.ok) {
      console.error('Erro na resposta do servidor:', await doctorRes.text());
      setError("Erro ao obter dados do médico. Verifique o console para mais detalhes.");
      return;
    }
    
    const doctorData = await doctorRes.json();
    console.log("Dados de médicos recebidos:", doctorData);
    
    // Obtém o email do médico armazenado na sessão/localStorage
    const loggedEmail = localStorage.getItem("email");
    if (!loggedEmail) {
      setError("Email não encontrado na sessão. Faça login novamente.");
      return;
    }
    
    console.log("Email atual:", loggedEmail);
    
    // A rota retorna um objeto com a propriedade "Medicos" (com M maiúsculo)
    const medicosArray = doctorData.Medicos || [];
    console.log("Array de médicos:", medicosArray);
    
    if (medicosArray.length === 0) {
      console.error("Array de médicos vazio");
      setError("Nenhum médico encontrado no sistema");
      return; // Importante: retornar aqui para evitar criar a prescrição sem médico
    }
    
    // Procura o médico cujo email corresponde ao email logado
    interface Medico {
      id: number;
      email: string;
      // Add other properties of the Medico object if needed
    }

    // Para fins de depuração, mostra todos os emails de médicos disponíveis
    console.log("Emails de médicos disponíveis:", medicosArray.map((m: Medico) => m.email));

    const doctor = medicosArray.find((d: Medico) => d.email.toLowerCase() === loggedEmail.toLowerCase());
    
    if (!doctor) {
      console.error(`Médico com email ${loggedEmail} não encontrado na lista`);
      setError(`Médico com email ${loggedEmail} não encontrado. Você precisa estar registrado como médico para criar prescrições.`);
      return; // Importante: retornar aqui para evitar criar a prescrição com médico incorreto
    }
    
    const doctorId = doctor.id;
    console.log("Doctor ID encontrado:", doctorId);

    // Cria a prescrição em espera (prescricao_on_hold)
    const resHold = await fetch(`${API_BASE_URL}/prescricao_on_hold/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_medico: doctorId,
        id_paciente: pacienteId,
        data_prescricao: new Date().toISOString(),
      }),
    });
    const dataHold = await resHold.json();
    if (!resHold.ok) {
      setError(dataHold.error || "Erro ao criar a prescrição");
      return;
    }
    // Assume que o id da prescrição criada seja retornado em dataHold.id
    const prescricaoOnHoldId = dataHold.id;
    console.log("PrescricaoOnHold ID:", prescricaoOnHoldId);

    // Para cada medicamento, cria um registro na tabela prescricao_medicamento
    for (const med of medications) {
      if (med.id_medicamento === "" || !med.quantity) continue;
      const payload = {
        id_prescricao_on_hold: prescricaoOnHoldId,
        id_medicamento: med.id_medicamento,
        quantidade: med.quantity,
        status_medicamento: "pendente",
      };
      const resMed = await fetch(
        `${API_BASE_URL}/prescricao_medicamento/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const dataMed = await resMed.json();
      if (!resMed.ok) {
        setError(dataMed.error || "Erro ao adicionar medicamento à prescrição");
        return;
      }
    }
    
    // Exibe feedback de sucesso
    alert("Prescrição criada com sucesso!");
    
    // Reseta os estados para voltar ao formulário inicial (dados do paciente)
    setPacienteNome("");
    setLeito("");
    setHC("");
    setPacienteId(null);
    setMedications([{ id: Date.now(), id_medicamento: "", quantity: "" }]);
    setStep(1);
    
  } catch (err) {
    console.error("Erro completo:", err);
    setError("Erro de conexão com o servidor");
  }
};

  return (
    <PageContainer>
      <PageContent>
        {step === 1 && (
          <FormCard>
            <SectionTitle>Dados do Paciente</SectionTitle>
            <form onSubmit={handlePatientSubmit}>
              <FormSection>
                <FormLabel>Nome do Paciente</FormLabel>
                <FormInput
                  type="text"
                  value={pacienteNome}
                  onChange={(e) => setPacienteNome(e.target.value)}
                  required
                />
              </FormSection>
              <FormSection>
                <FormLabel>Leito</FormLabel>
                <FormInput
                  type="text"
                  value={leito}
                  onChange={(e) => setLeito(e.target.value)}
                  required
                />
              </FormSection>
              <FormSection>
                <FormLabel>HC</FormLabel>
                <FormInput
                  type="text"
                  value={hc}
                  onChange={(e) => setHC(e.target.value)}
                  required
                />
              </FormSection>
              {error && <ErrorText>{error}</ErrorText>}
              <SaveButton type="submit">Próximo</SaveButton>
            </form>
          </FormCard>
        )}

        {step === 2 && (
          <FormCard>
            <SectionTitle>Dados da Prescrição</SectionTitle>
            <form onSubmit={handlePrescriptionSubmit}>
              {medications.map((med, index) => (
                <MedicationRow key={med.id}>
                  <MedicationSelect
                    value={med.id_medicamento}
                    onChange={(e) =>
                      handleMedicationChange(index, "id_medicamento", e.target.value)
                    }
                    required
                  >
                    <option value="">Selecione o Medicamento</option>
                    {availableMeds.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nome} - {m.dosagem}
                      </option>
                    ))}
                  </MedicationSelect>
                  <QuantityInput
                    type="number"
                    placeholder="Quantidade"
                    value={med.quantity}
                    min="1" 
                    onChange={(e) =>
                      handleMedicationChange(index, "quantity", e.target.value)
                    }
                    required
                  />
                </MedicationRow>
              ))}
              <ButtonRow>
                <AddMoreButton type="button" onClick={handleAddMedicationRow}>
                  Adicionar Medicamento
                </AddMoreButton>
                <SaveButton type="submit">Salvar Prescrição</SaveButton>
              </ButtonRow>
              {error && <ErrorText>{error}</ErrorText>}
            </form>
          </FormCard>
        )}
      </PageContent>
      <FooterWrapper>
        {/* Aqui pode ser inserido um Footer se necessário */}
      </FooterWrapper>
    </PageContainer>
  );
}

/* Styled Components (novo padrão) */

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
  align-items: center;
  width: 100%;
  padding: 0 15px;
  gap: 1.5rem;
  margin-top: 70px;
  padding-bottom: 80px;
`;

const FooterWrapper = styled.div`
  width: 100%;
  margin-top: auto;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
`;

const FormCard = styled.div`
  background-color: #34495e;
  border-radius: 10px;
  padding: 20px;
  width: 100%;
  max-width: 800px;
  color: white;
`;

const SectionTitle = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
`;

const FormSection = styled.div`
  margin-bottom: 20px;
`;

const FormLabel = styled.label`
  display: block;
  font-size: 18px;
  margin-bottom: 10px;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 12px;
  border-radius: 5px;
  border: none;
  font-size: 16px;
  background-color: white;
`;

const MedicationRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #f5f5f7;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
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

const QuantityInput = styled.input`
  width: 70px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
`;

const ButtonRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 30px;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const AddMoreButton = styled.button`
  background-color: #f5f5f7;
  color: #34495e;
  border: none;
  border-radius: 5px;
  padding: 12px 20px;
  font-size: 16px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #e5e5e7;
  }
`;

const SaveButton = styled.button`
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 12px 25px;
  font-size: 16px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #27ae60;
  }
`;

const ErrorText = styled.p`
  color: red;
  text-align: center;
  margin-top: 0.5rem;
`;

