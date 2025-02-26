import './estoque.css'

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
                    <AlertaMedicamento medicamento={"Paracetamol 750mg"} bin={4} unidades={12}/>
                </div>
            </div>

            <div class="secoes">
                <h2 class="titulo-secao">
                    Últimas Adições
                </h2>

                <div class="alertas">
                    <div class="alerta-medicamento">
                        <img src="mais.png" alt="Alerta" width="60" />
                        <div class="textos-alertas">
                            <div class="linha">
                                <p class="nome-remedio">Miosan 10mg</p>
                                <p class="bin">Bin 2</p>
                            </div>
                            <p class="quantidade-remedio-add">+ 60 unidades</p>
                        </div>
                    </div>
                    <div class="alerta-medicamento">
                        <img src="mais.png" alt="Alerta" width="60" />
                        <div class="textos-alertas">
                            <div class="linha">
                                <p class="nome-remedio">Sertralina 50mg</p>
                                <p class="bin">Bin 5</p>
                            </div>
                            <p class="quantidade-remedio-add">+ 75 unidades</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="secoes">
                <h2 class="titulo-secao">
                    Últimas Retiradas
                </h2>

                <div class="alertas">
                    <div class="alerta-medicamento">
                        <img src="menos.png" alt="Alerta" width="60" />
                        <div class="textos-alertas">
                            <div class="linha">
                                <p class="nome-remedio">Paracetamol 750mg</p>
                                <p class="bin">Bin 4</p>
                            </div>
                            <p class="quantidade-remedio">- 3 unidades</p>
                        </div>
                    </div>
                    <div class="alerta-medicamento">
                        <img src="menos.png" alt="Alerta" width="60" />
                        <div class="textos-alertas">
                            <div class="linha">
                                <p class="nome-remedio">Dipirona 1g</p>
                                <p class="bin">Bin 3</p>
                            </div>
                            <p class="quantidade-remedio">- 4 unidades</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="secoes">
                <h2 class="titulo-secao">
                    Visão Geral
                </h2>

                <div class="quadro">
                    <div class="titulos-quadro">
                        <p class="titulos-quadro">Bin</p>
                        <p class="titulos-quadro">Medicamento</p>
                        <p class="titulos-quadro">Quantidade</p>
                    </div>
                    <div class="medicamento-quadro">
                        <p class="bin">1</p>
                        <p class="nome-remedio">Loratadina 10mg</p>
                        <p class="quantidade-remedio">13 unidades</p>
                    </div>
                    <div class="medicamento-quadro">
                        <p class="bin">2</p>
                        <p class="nome-remedio">Loratadina 10mg</p>
                        <p class="quantidade-remedio">13 unidades</p>
                    </div>
                    <div class="medicamento-quadro">
                        <p class="bin">3</p>
                        <p class="nome-remedio">Loratadina 10mg</p>
                        <p class="quantidade-remedio">13 unidades</p>
                    </div>
                    <div class="medicamento-quadro">
                        <p class="bin">4</p>
                        <p class="nome-remedio">Loratadina 10mg</p>
                        <p class="quantidade-remedio">13 unidades</p>
                    </div>
                    <div class="medicamento-quadro">
                        <p class="bin">5</p>
                        <p class="nome-remedio">Loratadina 10mg</p>
                        <p class="quantidade-remedio">13 unidades</p>
                    </div>
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

function AlertaMedicamento ({medicamento, bin, unidades}){
    <div class="alerta-medicamento">
        <img src="/alerta.png" alt="Alerta" width="60" />
        <div class="textos-alertas">
            <div class="linha">
                <p class="nome-remedio">{medicamento}</p>
                <p class="bin">Bin {bin}</p>
            </div>
            <p class="quantidade-remedio-critico">{unidades} unidades</p>
        </div>
    </div>
}
