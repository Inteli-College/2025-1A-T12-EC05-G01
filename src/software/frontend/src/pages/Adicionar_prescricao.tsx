import { useState, useEffect } from "react";
import styled from "styled-components";
// Removido: import Header from "../components/sidebar/Navbar";
import Footer from "../components/Footer";

export default function AdicionarPrescricao() {
    const [availableMeds, setAvailableMeds] = useState<any[]>([]);
    const [medications, setMedications] = useState([
        { id: Date.now(), name: "", quantity: "" }
    ]);

    useEffect(() => {
        fetch("http://127.0.0.1:3000/medicamento/read-all")
            .then((res) => res.json())
            .then((data) => {
                if (data.medicamentos) {
                    setAvailableMeds(data.medicamentos);
                }
            })
            .catch((err) => console.error("Erro ao buscar medicamentos:", err));
    }, []);

    const handleAddMedication = () => {
        setMedications([...medications, { id: Date.now(), name: "", quantity: "" }]);
    };

    const [nomePaciente, setNomePaciente] = useState("");
    const [nomeMedico, setNomeMedico] = useState("");
    const [idPaciente, setIdPaciente] = useState("");

    const handleSavePrescricao = async () => {
        const payload = {
            paciente_nome: nomePaciente,
            medico_nome: nomeMedico,
            paciente_id: idPaciente,
            medicamentos: medications,
            id_prescricao_on_hold: Date.now().toString(),
            data_validacao: new Date().toISOString(),
            status_prescricao: "aguardando_separacao"
        };

        try {
            const res = await fetch("http://127.0.0.1:3000/prescricao_on_hold/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (res.ok) {
                alert("Prescrição salva com sucesso!");
                setNomePaciente("");
                setNomeMedico("");
                setIdPaciente("");
                setMedications([{ id: Date.now(), name: "", quantity: "" }]);
            } else {
                alert("Erro ao salvar: " + data.error);
            }
        } catch (error) {
            console.error("Erro ao salvar a prescrição:", error);
            alert("Erro de conexão com o servidor.");
        }
    };

    return (
        <PageContainer>
            {/* Removido a sidebar */}
            <PageContent>
                <PageHeader>
                    <h1>Adicionar Prescrição e Medicamentos</h1>
                </PageHeader>

                <FormCard>
                    <SectionTitle>Dados da Prescrição</SectionTitle>
                    <FormSection>
                        <FormLabel>Nome do paciente</FormLabel>
                        <FormInput
                            type="text"
                            value={nomePaciente}
                            onChange={(e) => setNomePaciente(e.target.value)}
                        />
                    </FormSection>

                    <FormSection>
                        <FormLabel>Nome do médico</FormLabel>
                        <FormInput
                            type="text"
                            value={nomeMedico}
                            onChange={(e) => setNomeMedico(e.target.value)}
                        />
                    </FormSection>

                    <FormSection>
                        <FormLabel>ID do paciente</FormLabel>
                        <FormInput
                            type="text"
                            value={idPaciente}
                            onChange={(e) => setIdPaciente(e.target.value)}
                        />
                    </FormSection>

                    <FormSection>
                        <FormLabel>Adicionar medicamentos</FormLabel>
                        {medications.map((med, index) => (
                            <MedicationRow key={med.id}>
                                <MedicationSelect
                                    value={med.name}
                                    onChange={(e) => {
                                        const updatedMeds = [...medications];
                                        updatedMeds[index].name = e.target.value;
                                        setMedications(updatedMeds);
                                    }}
                                >
                                    <option value="">Selecionar</option>
                                    {availableMeds.map((medicamento) => (
                                        <option key={medicamento.id} value={medicamento.nome}>
                                            {medicamento.nome}
                                        </option>
                                    ))}
                                </MedicationSelect>

                                <QuantityContainer>
                                    <QuantityLabel>Quantidade:</QuantityLabel>
                                    <QuantityInput
                                        type="text"
                                        value={med.quantity}
                                        onChange={(e) => {
                                            const updatedMeds = [...medications];
                                            updatedMeds[index].quantity = e.target.value;
                                            setMedications(updatedMeds);
                                        }}
                                    />
                                </QuantityContainer>
                            </MedicationRow>
                        ))}
                    </FormSection>

                    <ButtonRow>
                        <AddMoreButton onClick={handleAddMedication}>
                            Adicionar mais
                        </AddMoreButton>
                        <SaveButton onClick={handleSavePrescricao}>
                            Salvar
                        </SaveButton>
                    </ButtonRow>
                </FormCard>
            </PageContent>

            <FooterWrapper>
                <Footer />
            </FooterWrapper>
        </PageContainer>
    );
}

/* Styled Components */

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

const PageHeader = styled.div`
    width: 90%;
    max-width: 1200px;
    padding: 0 15px;
    margin: 2rem 0 1rem;

    h1 {
        color: #34495e;
        text-align: center;
        font-size: clamp(24px, 5vw, 36px);
        font-weight: 900;
    }
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

const QuantityContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const QuantityLabel = styled.span`
    color: #333;
    font-size: 16px;
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
