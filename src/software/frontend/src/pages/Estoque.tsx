import Popup from 'reactjs-popup';
import { useState } from "react";
import './estoque.css'
import alertaImg from '../assets/alerta.png';
import maisImg from '../assets/mais.png';
import menosImg from '../assets/menos.png';

export default function Estoque() {
    return (
        <div className="conteudo">
            <div className="topo-estoque">
                <h1 className="titulo-pagina">Controle de Estoque</h1>
                <PopupAdicionarMedicamentos />
            </div>

            <div className="secoes">
                <h2 className="titulo-secao">
                    Reabastecimentos Necessários
                </h2>

                <div className="alertas">
                {medicamentosReabastecer.map(medicamento => 
                    <AlertaMedicamento imagem={alertaImg} medicamento={medicamento.medicamento} bin={medicamento.bin} classe={ClasseUnidades(medicamento.unidades)} unidades={medicamento.unidades} />
                )}
                </div>
            </div>

            <div className="secoes">
                <h2 className="titulo-secao">
                    Últimas Adições
                </h2>

                <div className="alertas">
                    {medicamentosAdicionados.map(medicamento =>
                        <AlertaMedicamento imagem={maisImg} medicamento={medicamento.nome} bin={medicamento.bin} classe={"quantidade-remedio-add"} unidades={medicamento.unidades} />
                    )}
                </div>
            </div>

            <div className="secoes">
                <h2 className="titulo-secao">
                    Últimas Retiradas
                </h2>

                <div className="alertas">
                    {medicamentosRetirados.map(medicamento => 
                        <AlertaMedicamento imagem={menosImg} medicamento={medicamento.nome} bin={medicamento.bin} classe={"quantidade-remedio"} unidades={medicamento.unidades} />
                    )}
                </div>
            </div>

            <div className="secoes">
                <h2 className="titulo-secao">
                    Visão Geral
                </h2>

                <div className="quadro">
                    <TituloQuadro />
                    {medicamentosEstoque.map((medicamento) => (
                        <MedicamentoQuadro bin={medicamento.bin} nome={medicamento.nome} unidades={medicamento.unidades} />
                    ))}
                </div>
            </div>
        </div>
    );
  }

function PopupAdicionarMedicamentos() {
    return (
            <Popup trigger=
                {<button className="add-medicamento">
                    Adicionar<br />Medicamentos
                    <span className="mais">+</span>
                </button>} 
                modal nested>
                {
                    close => (
                        <div className='popup'>
                            <h2>Adicionar Medicamentos</h2>
                            <div>
                                <DadosMedicamentos />
                                <BotaoAddMais />
                            </div>
                            <div className="botoes-popup">
                                <button className="botao-cancelar" onClick=
                                    {() => close()}>Cancelar
                                </button>
                                <button className="botao-salvar">Salvar</button>
                            </div>
                        </div>
                    )
                }
            </Popup>
    )
};

function DadosMedicamentos(){
    return(
        <div className="dados-medicamento">
            <SelectMedicamento />
            <InputUnidades />
        </div>
    );
}

function SelectMedicamento(){
    return (
        <div className="dados-select-medicamento">
            <label for="select-dados-medicamento" className="texto-dados-medicamento">Medicamento:</label>
            <select className="select-dados-medicamento">
                <option value="" selected disabled hidden>Selecione</option>
                {medicamentosEstoque.map(x => <option value="teste">{x.nome}</option>)}
            </select>
        </div>
    );
}

function InputUnidades(){
    return(
        <div className="dados-unidades">
            <label for="input-unidades" className="texto-dados-medicamento">Quantidade:</label>
            <input className="input-unidades" type="number" placeholder={0} ></input>
        </div>
    );
}

function BotaoAddMais() {
  const [items, setItems] = useState([]);

  const addItem = () => {
    setItems([...items, { id: items.length}]);
  };

  return (
    <div>
      <div className="mt-4 space-y-2">
        {items.map((item) => (
          <DadosMedicamentos />
        ))}
      </div>
      <button onClick={addItem} className="btn-add-mais">
        Adicionar Mais
      </button>
    </div>
  );
}

function AlertaMedicamento ({imagem, medicamento, bin, classe, unidades}){
    return (
        <div className="alerta-medicamento">
            <img src={imagem} alt="Alerta" width="60" />
            <div className="textos-alertas">
                <div className="linha">
                    <p className="nome-remedio">{medicamento}</p>
                    <p className="bin">Bin {bin}</p>
                </div>
                <p className={classe}>{unidades} unidades</p>
            </div>
        </div>
    );
}

function TituloQuadro (){
    return(
        <div className="titulos-quadro">
            <p className="titulos-quadro">Bin</p>
            <p className="titulos-quadro">Medicamento</p>
            <p className="titulos-quadro">Quantidade</p>
        </div>
    );
}

function MedicamentoQuadro ({bin, nome, unidades}){
    return (
        <div className="medicamento-quadro">
            <p className="bin">{bin}</p>
            <p className="nome-remedio">{nome}</p>
            <p className={ClasseUnidades(unidades)}>{unidades} unidades</p>
        </div>
    );
}

function ClasseUnidades (unidades){
    switch (true){
        case (unidades <= 10):
            return "quantidade-remedio-critico";
        case (unidades < 30):
            return "quantidade-remedio";
        case (unidades >= 30):
            return "quantidade-remedio-add";
    }
}

var medicamentosReabastecer = [{
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

var medicamentosAdicionados = [{
    bin: 2,
    nome: "Miosan 10mg", 
    unidades: "+ 60"
},
{
    bin: 5,
    nome: "Sertralina 50mg", 
    unidades: "+ 75"
}]

var medicamentosRetirados = [{
    bin: 4,
    nome: "Paracetamol 750mg",
    unidades: "- 3"
},
{
    bin: 3,
    nome: "Dipirona 1g",
    unidades: "- 4"
}]

var medicamentosEstoque = [{
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