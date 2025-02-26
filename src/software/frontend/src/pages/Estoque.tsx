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
                    <AlertaMedicamento imagem={alertaImg} medicamento={"Paracetamol 750mg"} bin={4} unidades={12}/>
                </div>
            </div>

            <div class="secoes">
                <h2 class="titulo-secao">
                    Últimas Adições
                </h2>

                <div class="alertas">
                    <AlertaMedicamento imagem={maisImg} medicamento={"Miosan 10mg"} bin={2} unidades={"+ 60"} />
                </div>
            </div>

            <div class="secoes">
                <h2 class="titulo-secao">
                    Últimas Retiradas
                </h2>

                <div class="alertas">
                    <AlertaMedicamento imagem={menosImg} medicamento={"Paracetamol 750mg"} bin={4} unidades={"- 3"}/>
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

function AlertaMedicamento ({imagem, medicamento, bin, unidades}){
    return (
        <div class="alerta-medicamento">
            <img src={imagem} alt="Alerta" width="60" />
            <div class="textos-alertas">
                <div class="linha">
                    <p class="nome-remedio">{medicamento}</p>
                    <p class="bin">Bin {bin}</p>
                </div>
                <p class="quantidade-remedio-critico">{unidades} unidades</p>
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
            <p class="quantidade-remedio">{unidades} unidades</p>
        </div>
    );
}

var medicamentosEstoque = [{
    bin: 1,
    nome: "Loratadina 10mg",
    unidades: 12
},
{
    bin: 2,
    nome: "Loratadina 10mg",
    unidades: 12
}]