import Popup from 'reactjs-popup';
import { useState, useEffect } from "react";
import styled from 'styled-components';
import alertaImg from '../assets/alerta.png';
import menosImg from '../assets/menos.png';
import Header from '../components/sidebar/Navbar';
import Footer from '../components/Footer';
import API_BASE_URL from '../config/api';

export default function Estoque() {

  const [medicamentosEstoque, setMedicamentosEstoque] = useState([]);
  const [medicamentosRetirados, setMedicamentosRetirados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMedicamentosEstoque() {
      try {
        const response = await fetch(`${API_BASE_URL}/estoque/bin-quantidade/read`);
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        const data = await response.json();
        setMedicamentosEstoque(data.dados || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  
    async function getMedicamentosRetirados() {
      try {
        const hoje = new Date();
        const dataFormatada = hoje.toISOString().split('T')[0];
        
        const response = await fetch(`${API_BASE_URL}/saidas/read-all`, {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            "data_saida": dataFormatada
          })
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch retirados');
        }
        
        const data = await response.json();
        return data.saidas || [];
      } catch (err) {
        console.error("Erro ao buscar medicamentos retirados:", err);
        return [];
      }
    }
  
    async function fetchData() {
      setLoading(true);
      try {
        await fetchMedicamentosEstoque();
        const medicamentosRetirados = await getMedicamentosRetirados();
        setMedicamentosRetirados(medicamentosRetirados);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  
    fetchData();
  }, []);

    return (
        <PageContainer>
            <nav><Header /></nav>
            <PageContent>
                <PageHeader>
                    <h1>Controle de Estoque</h1>
                    <PopupAdicionarMedicamentos />
                </PageHeader>

                <SectionWrapper>
                    <SectionTitle>Reabastecimentos Necessários</SectionTitle>
                    <SectionContent>
                        {medicamentosReabastecer.map((medicamento, index) => 
                            <AlertaMedicamento 
                                key={index}
                                imagem={alertaImg} 
                                medicamento={medicamento.medicamento} 
                                bin={medicamento.bin} 
                                classe={ClasseUnidades({ unidades: medicamento.unidades })} 
                                unidades={medicamento.medicamento.quantidade} 
                            />
                        )}
                    </SectionContent>
                </SectionWrapper>

                <SectionWrapper>
                    <SectionTitle>Últimas Retiradas</SectionTitle>
                    <SectionContent>
                        {medicamentosRetirados.map((medicamento, index) => 
                            <AlertaMedicamento 
                                key={index}
                                imagem={menosImg} 
                                medicamento={medicamento.medicamento.nome + " " + medicamento.medicamento.dosagem} 
                                classe={"quantidade-remedio"} 
                                unidades={medicamento.quantidade} 
                            />
                        )}
                    </SectionContent>
                </SectionWrapper>

                <SectionWrapper>
                    <SectionTitle>Visão Geral</SectionTitle>
                    <QuadroContainer>
                        <TituloQuadro />
                        {medicamentosEstoque.map((medicamento, index) => (
                            <MedicamentoQuadro 
                                key={index}
                                bin={medicamento.bin} 
                                nome={medicamento.medicamento} 
                                unidades={medicamento.quantidade} 
                            />
                        ))}
                    </QuadroContainer>
                </SectionWrapper>

              <FooterWrapper>
                <Footer />
              </FooterWrapper>
            </PageContent>
        </PageContainer>
    );
}

function PopupAdicionarMedicamentos() {
    return (
            <Popup 
                trigger={
                    <AddMedicamentoButton>
                        Adicionar<br />Medicamentos
                        <MaisSpan>+</MaisSpan>
                    </AddMedicamentoButton>
                } 
                modal 
                nested
                contentStyle={{ 
                    width: '100%',
                    maxWidth: '700px',
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
                {
                    (close: () => void) => (
                        <PopupContainer>
                            <PopupHeader>Adicionar Medicamentos</PopupHeader>
                            <PopupContent>
                                <DadosMedicamentos />
                                <BotaoAddMais />
                            </PopupContent>
                            <BotoesPopupContainer>
                                <BotaoCancelar onClick={() => close()}>
                                    Cancelar
                                </BotaoCancelar>
                                <BotaoSalvar>Salvar</BotaoSalvar>
                            </BotoesPopupContainer>
                        </PopupContainer>
                    )
                }
            </Popup>
    )
};

function DadosMedicamentos(){
    return(
        <DadosMedicamentoContainer>
            <SelectMedicamento />
            <InputUnidades />
        </DadosMedicamentoContainer>
    );
}

function SelectMedicamento(){
    return (
        <DadosSelectMedicamentoContainer>
            <TextoDadosMedicamento>Medicamento:</TextoDadosMedicamento>
            <SelectDadosMedicamento>
                <option value="" selected disabled hidden>Selecione</option>
                {medicamentosEstoque.map(x => <option value="teste">{x.nome}</option>)}
            </SelectDadosMedicamento>
        </DadosSelectMedicamentoContainer>
    );
}

function InputUnidades(){
    return(
        <DadosUnidadesContainer>
            <TextoDadosMedicamento>Quantidade:</TextoDadosMedicamento>
            <InputUnidadesStyle type="number" placeholder="0"></InputUnidadesStyle>
        </DadosUnidadesContainer>
    );
}

function BotaoAddMais() {
  const [items, setItems] = useState<{ id: number }[]>([]);

  const addItem = () => {
    setItems([...items, { id: items.length}]);
  };

  return (
    <div>
      <div className="mt-4 space-y-2">
        {items.map(() => (
          <DadosMedicamentos />
        ))}
      </div>
      <BtnAddMais onClick={addItem}>
        Adicionar Mais
      </BtnAddMais>
    </div>
  );
}

interface MedicamentoProps {
    imagem: string;
    medicamento: string;
    bin: number;
    classe: string;
    unidades: number;
}

function AlertaMedicamento ({imagem, medicamento, classe, unidades}: MedicamentoProps){
    return (
        <AlertaMedicamentoContainer>
            <img src={imagem} alt="Alerta" />
            <TextosAlertasContainer>
                <LinhaContainer>
                    <NomeRemedio>{medicamento}</NomeRemedio>
                </LinhaContainer>
                {classe === "quantidade-remedio" && <QuantidadeRemedio>{unidades} unidades</QuantidadeRemedio>}
                {classe === "quantidade-remedio-critico" && <QuantidadeRemedioCritico>{unidades} unidades</QuantidadeRemedioCritico>}
                {classe === "quantidade-remedio-add" && <QuantidadeRemedioAdd>{unidades} unidades</QuantidadeRemedioAdd>}
            </TextosAlertasContainer>
        </AlertaMedicamentoContainer>
    );
}

function TituloQuadro (){
    return(
        <TitulosQuadroContainer>
            <QuadroText>Bin</QuadroText>
            <QuadroText>Medicamento</QuadroText>
            <QuadroText>Quantidade</QuadroText>
        </TitulosQuadroContainer>
    );
}

function MedicamentoQuadro ({bin, nome, unidades}: { bin: number, nome: string, unidades: number }){
    return (
        <MedicamentoQuadroContainer>
            <BinText>{bin}</BinText>
            <NomeRemedio>{nome}</NomeRemedio>
            {unidades <= 10 && <QuantidadeRemedioCritico>{unidades} unidades</QuantidadeRemedioCritico>}
            {unidades > 10 && unidades < 30 && <QuantidadeRemedio>{unidades} unidades</QuantidadeRemedio>}
            {unidades >= 30 && <QuantidadeRemedioAdd>{unidades} unidades</QuantidadeRemedioAdd>}
        </MedicamentoQuadroContainer>
    );
}

function ClasseUnidades ({ unidades }: { unidades: number }): string {
    switch (true) {
        case (unidades <= 10):
            return "quantidade-remedio-critico";
        case (unidades < 30):
            return "quantidade-remedio";
        case (unidades >= 30):
            return "quantidade-remedio-add";
        default:
            return "";
    }
}

const getMedicamentosEstoque = async () => {
  const response = await fetch(`${API_BASE_URL}/estoque/bin-quantidade/read`);
  const data = await response.json();
  return data.dados;
}

const medicamentosEstoque = await getMedicamentosEstoque();

const medicamentosReabastecer = medicamentosEstoque.filter(
  medicamento => medicamento.quantidade <= 10
);

const getMedicamentosRetirados = async () => {
  const hoje = new Date();
  const dataFormatada = hoje.toISOString().split('T')[0];
  
  const response = await fetch(`${API_BASE_URL}/saidas/read-all`, {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      "data_saida": dataFormatada
    })
  });
  
  const data = await response.json();
  return data.saidas;
}
const medicamentosRetirados = await getMedicamentosRetirados();

// Styled Components
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh; /* Ensure full viewport height */
  position: relative;
`;

const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 0 15px;
  margin-top: 70px;
  padding-bottom: 80px;
`;

const PageHeader = styled.div`
  width: 90%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 2rem 0 1rem;
  gap: 20px;
  
  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  
  h1 {
    color: #34495E;
    font-size: clamp(24px, 5vw, 36px);
    font-weight: 900;
    text-align: center;
    
    @media (min-width: 768px) {
      text-align: left;
    }
  }
`;

const SectionWrapper = styled.section`
  width: 90%;
  max-width: 1200px;
  margin: 1.5rem 0;
  background-color: #D9D9D9;
  border-radius: 15px;
  padding: 1.5rem;
`;

const SectionTitle = styled.h3`
  color: #34495E;
  font-size: clamp(18px, 4vw, 24px);
  font-weight: 700;
  margin-bottom: 1rem;
`;

const SectionContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const AlertaMedicamentoContainer = styled.div`
  display: flex;
  width: 100%;
  max-width: 600px;
  align-items: center;
  gap: 20px;
  background-color: #34495E;
  padding: 15px;
  border-radius: 15px;
  margin-bottom: 10px;
  
  img {
    width: 40px;
    height: auto;
    
    @media (min-width: 576px) {
      width: 60px;
    }
  }
`;



const AddMedicamentoButton = styled.button`
  background-color: #2ECC71;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px 10px 10px;
  color: #FFFFFF;
  font-family: 'Montserrat';
  font-size: 18px;
  font-weight: bold;
  border-color: #2ECC71;
  cursor: pointer;
  border-radius: 15px;
  transition: background-color .3s;
  height: 60px;
  width: 180px;
`;

const MaisSpan = styled.span`
  font-size: 40px;
`;

const PopupContainer = styled.div`
  background-color: #2C3E50;
  font-family: 'Montserrat';
  border-radius: 20px;
  width: 100%;
  max-width: 700px;
  overflow: hidden;
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.2);
`;

const PopupHeader = styled.h2`
  color: white;
  padding: 20px;
  margin: 0;
  text-align: center;
  font-size: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const PopupContent = styled.div`
  padding: 20px;
`;

const TextoDadosMedicamento = styled.label`
  font-family: 'Montserrat';
  font-size: 19px;
  color: #2C3E50;
`;

const DadosMedicamentoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #D9D9D9;
  border-radius: 13px;
  height: 50px;
  gap: 30px;
  margin: 5px;
`;

const InputUnidadesStyle = styled.input`
  background-color: #D9D9D9;
  color: #2C3E50;
  font-family: 'Montserrat';
  font-size: 19px;
  width: 50px;
  margin: 7px;
  border-radius: 5px;
`;

const DadosSelectMedicamentoContainer = styled.div`
  display: flex;
  justify-items: center;
  align-items: center;
`;

const DadosUnidadesContainer = styled.div`
  display: flex;
  justify-items: center;
  align-items: center;
`;

const SelectDadosMedicamento = styled.select`
  background-color: #D9D9D9;
  color: #2C3E50;
  font-family: 'Montserrat';
  font-size: 19px;
  border-radius: 5px;
  margin: 5px;
`;

const BtnAddMais = styled.button`
  font-family: 'Montserrat';
  font-size: 16px;
  font-weight: 500;
  border: none;
  width: 125px;
  padding: 8px 0;
  margin-top: 10px;
  border-radius: 10px;
  background-color: #D9D9D9;
  color: #2C3E50;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #bfbfbf;
  }
`;

const BotoesPopupContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 15px 20px;
  background-color: rgba(0, 0, 0, 0.1);
  gap: 12px;
`;

const BotaoCancelar = styled.button`
  background-color: #D9D9D9;
  color: #2C3E50;
  font-family: 'Montserrat';
  font-size: 16px;
  font-weight: 600;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #bfbfbf;
  }
`;

const BotaoSalvar = styled.button`
  background-color: #2ECC71;
  color: white;
  font-family: 'Montserrat';
  font-size: 16px;
  font-weight: 600;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #27ae60;
  }
`;

const LinhaContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const TextosAlertasContainer = styled.div`
  align-items: center;
  font-family: 'Montserrat';
  font-size: 24px;
`;

const NomeRemedio = styled.p`
  font-weight: bold;
  color: #FFFFFF;
  font-family: 'Montserrat';
  font-size: clamp(16px, 4vw, 24px);
  margin: 0;
  word-break: break-word;
`;

const QuantidadeRemedio = styled.p`
  color: #E9B78A;
  font-family: 'Montserrat';
  font-size: 24px;
`;

const QuantidadeRemedioCritico = styled.p`
  color: #E67E22;
  font-family: 'Montserrat';
  font-size: 24px;
`;

const BinText = styled.p`
  color: #FFFFFF;
  font-family: 'Montserrat';
  font-size: 24px;
`;

const QuantidadeRemedioAdd = styled.p`
  color: #2ECC71;
  font-family: 'Montserrat';
  font-size: 24px;
`;

const TitulosQuadroContainer = styled.div`
  background-color: #323848;
  display: flex;
  justify-content: space-between;
  padding-left: 10px;
  padding-right: 10px;
  align-items: center;
  margin: 10px;
  border-radius: 20px;
  width: 100%;
  max-width: 500px;
  height: 50px;
  font-size: clamp(16px, 4vw, 24px);
  color: #FFFFFF;
  font-family: 'Montserrat';
  
  @media (min-width: 576px) {
    padding-left: 20px;
    padding-right: 20px;
  }
`;

const MedicamentoQuadroContainer = styled.div`
  background-color: #2C3E50;
  display: flex;
  justify-content: space-between;
  padding-left: 10px;
  padding-right: 10px;
  align-items: center;
  margin: 10px;
  border-radius: 20px;
  width: 100%;
  max-width: 500px;
  min-height: 50px;
  
  @media (min-width: 576px) {
    padding-left: 20px;
    padding-right: 20px;
  }
`;

const QuadroContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const QuadroText = styled.p`
  color: #FFFFFF;
  font-family: 'Montserrat';
  font-size: 24px;
`;

const FooterWrapper = styled.div`
  width: 100%;
  margin-top: auto; /* Push to bottom if content is short */
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
`;