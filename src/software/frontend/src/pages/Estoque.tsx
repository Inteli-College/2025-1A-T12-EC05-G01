import './estoque.css'
import alertaImg from '../assets/alerta.png';
import maisImg from '../assets/mais.png';
import menosImg from '../assets/menos.png';

export default function Estoque() {
    return (
        <div class="conteudo">
            <div class="topo-estoque">
                <h1 class="titulo-pagina">Controle de Estoque</h1>
                <AdicionarRemedio />
            </div>

            <div class="secoes">
                <h2 class="titulo-secao">
                    Reabastecimentos Necessários
                </h2>

                <div class="alertas">
                {medicamentosReabastecer.map(medicamento => 
                    <AlertaMedicamento imagem={alertaImg} medicamento={medicamento.medicamento} bin={medicamento.bin} classe={ClasseUnidades(medicamento.unidades)} unidades={medicamento.unidades} />
                )}
                </div>
            </div>

            <div class="secoes">
                <h2 class="titulo-secao">
                    Últimas Adições
                </h2>

                <div class="alertas">
                    {medicamentosAdicionados.map(medicamento =>
                        <AlertaMedicamento imagem={maisImg} medicamento={medicamento.nome} bin={medicamento.bin} classe={"quantidade-remedio-add"} unidades={medicamento.unidades} />
                    )}
                </div>
            </div>

            <div class="secoes">
                <h2 class="titulo-secao">
                    Últimas Retiradas
                </h2>

                <div class="alertas">
                    {medicamentosRetirados.map(medicamento => 
                        <AlertaMedicamento imagem={menosImg} medicamento={medicamento.nome} bin={medicamento.bin} classe={"quantidade-remedio"} unidades={medicamento.unidades} />
                    )}
                </div>
            </div>

            <div class="secoes">
                <h2 class="titulo-secao">
                    Visão Geral
                </h2>

                <div class="quadro">
                    <TituloQuadro />
                    {medicamentosEstoque.map((medicamento) => (
                        <MedicamentoQuadro bin={medicamento.bin} nome={medicamento.nome} unidades={medicamento.unidades} />
                    ))}
                </div>
            </div>
        </div>
    );
  }

function AdicionarRemedio() {
    return (
        <button class="add-medicamento">
            Adicionar<br />Medicamentos
            <span class="mais">+</span>
        </button>
    );
  }

function AlertaMedicamento ({imagem, medicamento, bin, classe, unidades}){
    return (
        <div class="alerta-medicamento">
            <img src={imagem} alt="Alerta" width="60" />
            <div class="textos-alertas">
                <div class="linha">
                    <p class="nome-remedio">{medicamento}</p>
                    <p class="bin">Bin {bin}</p>
                </div>
                <p class={classe}>{unidades} unidades</p>
            </div>
        </div>
    );
}

function TituloQuadro (){
    return(
        <div class="titulos-quadro">
            <p class="titulos-quadro">Bin</p>
            <p class="titulos-quadro">Medicamento</p>
            <p class="titulos-quadro">Quantidade</p>
        </div>
    );
}

function MedicamentoQuadro ({bin, nome, unidades}){
    return (
        <div class="medicamento-quadro">
            <p class="bin">{bin}</p>
            <p class="nome-remedio">{nome}</p>
            <p class={ClasseUnidades(unidades)}>{unidades} unidades</p>
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