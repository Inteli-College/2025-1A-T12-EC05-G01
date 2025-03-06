import Popup from 'reactjs-popup';
import { useState } from "react";
import styled, { createGlobalStyle } from 'styled-components';
import alertaImg from '../assets/alerta.png';
import maisImg from '../assets/mais.png';
import menosImg from '../assets/menos.png';

// Add a GlobalStyle component for body styling
const GlobalStyle = createGlobalStyle`
  body {
    background-color: #ECF0F1;
    justify-content: center;
    margin: 0;
    padding: 0;
  }
`;

export default function Estoque() {
    return (
        <>
            <GlobalStyle />
            <EstoqueContainer>
                <TopoEstoque>
                    <TituloPagina>Controle de Estoque</TituloPagina>
                    <PopupAdicionarMedicamentos />
                </TopoEstoque>

                <SecaoContainer>
                    <TituloSecao>
                        Reabastecimentos Necessários
                    </TituloSecao>

                    <AlertasContainer>
                    {medicamentosReabastecer.map(medicamento => 
                        <AlertaMedicamento imagem={alertaImg} medicamento={medicamento.medicamento} bin={medicamento.bin} classe={ClasseUnidades({ unidades: medicamento.unidades })} unidades={medicamento.unidades} />
                    )}
                    </AlertasContainer>
                </SecaoContainer>

                <SecaoContainer>
                    <TituloSecao>
                        Últimas Adições
                    </TituloSecao>

                    <AlertasContainer>
                        {medicamentosAdicionados.map(medicamento =>
                            <AlertaMedicamento imagem={maisImg} medicamento={medicamento.nome} bin={medicamento.bin} classe={"quantidade-remedio-add"} unidades={medicamento.unidades} />
                        )}
                    </AlertasContainer>
                </SecaoContainer>

                <SecaoContainer>
                    <TituloSecao>
                        Últimas Retiradas
                    </TituloSecao>

                    <AlertasContainer>
                        {medicamentosRetirados.map(medicamento => 
                            <AlertaMedicamento imagem={menosImg} medicamento={medicamento.nome} bin={medicamento.bin} classe={"quantidade-remedio"} unidades={medicamento.unidades} />
                        )}
                    </AlertasContainer>
                </SecaoContainer>

                <SecaoContainer>
                    <TituloSecao>
                        Visão Geral
                    </TituloSecao>

                    <QuadroContainer>
                        <TituloQuadro />
                        {medicamentosEstoque.map((medicamento) => (
                            <MedicamentoQuadro bin={medicamento.bin} nome={medicamento.nome} unidades={medicamento.unidades} />
                        ))}
                    </QuadroContainer>
                </SecaoContainer>
            </EstoqueContainer>
        </>
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

function AlertaMedicamento ({imagem, medicamento, bin, classe, unidades}: MedicamentoProps){
    return (
        <AlertaMedicamentoContainer>
            <img src={imagem} alt="Alerta" width="60" />
            <TextosAlertasContainer>
                <LinhaContainer>
                    <NomeRemedio>{medicamento}</NomeRemedio>
                    <BinText>Bin {bin}</BinText>
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

const medicamentosReabastecer = [{
    medicamento: "Paracetamol 750mg",
    bin: 4,
    unidades: 6
},
{
    medicamento: "Dipirona 1g",
    bin: 3,
    unidades: 12
},
{
    medicamento: "Loratadina 10mg",
    bin: 1,
    unidades: 13
}]

const medicamentosAdicionados = [{
    bin: 2,
    nome: "Miosan 10mg", 
    unidades: 60
},
{
    bin: 5,
    nome: "Sertralina 50mg", 
    unidades: 75
}]

const medicamentosRetirados = [{
    bin: 4,
    nome: "Paracetamol 750mg",
    unidades: -3
},
{
    bin: 3,
    nome: "Dipirona 1g",
    unidades: -4
}]

const medicamentosEstoque = [{
    bin: 1,
    nome: "Loratadina 10mg",
    unidades: 13
},
{
    bin: 2,
    nome: "Miosan 10mg",
    unidades: 76
},
{
    bin: 3,
    nome: "Dipirona 1g",
    unidades: 12
},
{
    bin: 4,
    nome: "Paracetamol 750mg",
    unidades: 6
},
{
    bin: 5,
    nome: "Sertralina 50mg",
    unidades: 81
}]

// Styled Components
const EstoqueContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: #ECF0F1;
  width: 100%;
  min-height: 100vh;
`;

const TopoEstoque = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 30px;
  width: 800px;
`;

const TituloPagina = styled.h1`
  color: #2C3E50;
  font-family: 'Montserrat';
  font-size: 70px;
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

const SecaoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: top;
  background-color: #D9D9D9;
  border-radius: 26px;
  padding: 5px;
  width: 800px;
  margin: 30px;
`;

const TituloSecao = styled.h2`
  font-family: 'Montserrat';
  margin: 30px;
  color: #2C3E50;
`;

const AlertasContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const AlertaMedicamentoContainer = styled.div`
  display: flex;
  width: 400px;
  align-items: center;
  gap: 20px;
  background-color: #34495E;
  padding: 10px 20px;
  border-radius: 26px;
  margin: 10px;
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
  font-size: 24px;
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
  padding-left: 20px;
  padding-right: 20px;
  align-items: center;
  margin: 10px;
  border-radius: 20px;
  width: 500px;
  height: 50px;
  font-size: 24px;
  color: #FFFFFF;
  font-family: 'Montserrat';
`;

const MedicamentoQuadroContainer = styled.div`
  background-color: #2C3E50;
  display: flex;
  justify-content: space-between;
  padding-left: 20px;
  padding-right: 20px;
  align-items: center;
  margin: 10px;
  border-radius: 20px;
  width: 500px;
  height: 50px;
`;

const QuadroContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const QuadroText = styled.p`
  color: #FFFFFF;
  font-family: 'Montserrat';
  font-size: 24px;
`;