import styled from "styled-components";
import Header from "../components/sidebar/Navbar";
import { useState, useEffect } from 'react'

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

  .topo {
    margin-top: 86px;
    display: flex;
    max-width: 1200px;
    padding: 0 15px;
    color: #34495E;
    font-size: clamp(20px, 5vw, 28px);
    font-weight: 900;
  }

  > button {
    background-color: #34495E;
    border-radius: 15px;
    padding: 1.25rem 2.5rem; 
    border-style: none;
    margin-top: 2rem;

    color: #ECF0F1;
    font-size: clamp(20px, 5vw, 28px);
    font-weight: 900;
  }

  > button:hover {
    background-color:#2C3E50; 
  }

  .ponto {
    display: flex;
    flex-direction: row;
    align-items: center; 
    padding: 0.5rem 0;
    min-width: 200px; 
  }
  
  .ponto p {
    margin-right: 0.5rem; 
  }

  .ponto input {
    flex: 1; 
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .btn-add {
    background-color: #2ECC71;
  }

  .btn-add:hover {
    background-color: #178B48;
  }

  .checkboxes {
    margin-top: 3rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .direcao-movimentos, .succao {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .direcao-movimentos input, .succao input {
    appearance: none;
    width: 20px;
    height: 20px;
    border: 2px solid #34495E;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: relative;
  }

  .direcao-movimentos input:checked, .succao input:checked {
    background-color: #2ECC71;
    border-color: #2ECC71;
  }

  .direcao-movimentos input:checked::after, .succao input:checked::after {
    content: "✔";
    color: white;
    font-size: 16px;
    font-weight: bold;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .direcao-movimentos label, .succao label {
    font-size: 18px;
    font-weight: 600;
    color: #34495E;
    cursor: pointer;
  }

  .pontos-adicionados {
    margin: 2rem 0;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    width: 80%;
    max-width: 600px;

    h3 {
      margin-bottom: 1rem;
      color: #34495E;
    }

    div {
      padding: 0.5rem;
      border-bottom: 1px solid #eee;
      font-size: 14px;
      
      &:last-child {
        border-bottom: none;
      }
    }
  }

  .existing-bins {
    margin: 2rem 0;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    width: 80%;
    max-width: 600px;

    h3 {
      margin-bottom: 1rem;
      color: #34495E;
    }

    .bin-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem;
      border-bottom: 1px solid #eee;

      &:last-child {
        border-bottom: none;
      }

      button {
        background-color: #e74c3c;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;

        &:hover {
          background-color: #c0392b;
        }
      }
    }
  }
`;

let DOBOT_URL = "http://127.0.0.1:5000";

interface Ponto {
  ponto: number;
  x: number;
  y: number;
  z: number;
  r: number;
  movimento: string;
  suctionCup: string;
}

interface Medicamento {
  medicamento: number;
  pontos: Ponto[];
}

function AdicionarBin() {
  const [moveL, setMoveL] = useState(false);
  const [suction, setSuction] = useState(false);
  const [medicamentoId, setMedicamentoId] = useState('');
  const [pontos, setPontos] = useState<Ponto[]>([]);
  const [existingBins, setExistingBins] = useState<Medicamento[]>([]);

  const fetchExistingBins = () => {
    fetch(`${DOBOT_URL}/dobot/bin/visualizar`)
      .then(response => response.json())
      .then(data => setExistingBins(data.bins))
      .catch(error => console.error("Erro ao carregar bins:", error));
  };

  useEffect(() => {
    fetchExistingBins();
  }, []);

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newId = e.target.value;
    
    if (pontos.length > 0 && newId !== medicamentoId) {
      const confirmChange = window.confirm(
        "Alterar o ID irá limpar todos os pontos. Deseja continuar?"
      );
      
      if (confirmChange) {
        setPontos([]);
        setMedicamentoId(newId);
      } else {
        setMedicamentoId(medicamentoId);
      }
    } else {
      setMedicamentoId(newId);
    }
  };

  function fetchPontos() {
    return fetch(`${DOBOT_URL}/dobot/posicao`)
      .then(response => response.json())
      .then(data => {
        if (data.pontos && 
            data.pontos.x !== undefined && 
            data.pontos.y !== undefined && 
            data.pontos.z !== undefined && 
            data.pontos.r !== undefined) {
          
            const novoPonto: Ponto = {
            ponto: pontos.length + 1,
            x: parseFloat(data.pontos.x.toFixed(2)),
            y: parseFloat(data.pontos.y.toFixed(2)),
            z: parseFloat(data.pontos.z.toFixed(2)),
            r: data.pontos.r,
            movimento: moveL ? "movl" : "movj",
            suctionCup: suction ? "on" : "off"
            };
          
          setPontos(prev => [...prev, novoPonto]);
          return novoPonto;
        } else {
          console.error("Estrutura de dados inválida:", data);
          return null;
        }
      })
      .catch(error => {
        console.error("Erro ao obter posição:", error);
        return null;
      });
  }

  const addPonto = () => {
    if (!medicamentoId) {
      window.alert("Por favor, insira o ID do medicamento primeiro.");
      return;
    }
    
    fetchPontos().then(ponto => {
      if (!ponto) {
        window.alert("Falha ao obter posição do Dobot");
      }
    });
  };

  const sendBin = () => {
    if (!medicamentoId) {
      window.alert("Por favor, insira o ID do medicamento.");
      return;
    }
    
    if (pontos.length === 0) {
      window.alert("Por favor, adicione pelo menos um ponto.");
      return;
    }

    const id = parseInt(medicamentoId, 10);
    
    if (isNaN(id)) {
      window.alert("ID do medicamento inválido.");
      return;
    }

    if (id <= 5) {
      window.alert("IDs de 1 a 5 são reservados.");
      return;
    }

    const dadosParaEnvio = {
      medicamento: id,
      pontos: pontos.map(p => ({
        ponto: p.ponto,
        x: p.x,
        y: p.y,
        z: p.z,
        r: p.r,
        movimento: p.movimento,
        suctionCup: p.suctionCup
      }))
    };

    fetch(`${DOBOT_URL}/dobot/bin/adicionar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dadosParaEnvio),
    })
      .then(response => {
        if (response.ok) {
          window.alert("Bin cadastrado com sucesso!");
          setPontos([]);
          setMedicamentoId('');
          fetchExistingBins();
        } else {
          response.json().then(err => {
            window.alert(`Erro: ${err.erro}`);
          });
        }
      })
      .catch(error => {
        console.error("Erro na requisição:", error);
        window.alert("Erro ao cadastrar bin");
      });
  }

  const deleteMedicamento = (id: number) => {
    if (id <= 5) {
      alert("IDs 1-5 são reservados e não podem ser removidos.");
      return;
    }
    
    if (window.confirm(`Tem certeza que deseja remover o medicamento ${id}?`)) {
      fetch(`${DOBOT_URL}/dobot/bin/remover/${id}`, {
        method: 'POST',
      })
      .then(response => {
        if (response.ok) {
          fetchExistingBins();
          alert("Medicamento removido com sucesso!");
        } else {
          response.json().then(err => alert(err.erro));
        }
      })
      .catch(error => alert("Erro ao remover medicamento"));
    }
  };

  const selectMove = () => setMoveL(!moveL);
  
  const selectSuction = () => {
    const newState = !suction;
    const suctionEndpoint = newState ? 'on' : 'off';
    
    fetch(`${DOBOT_URL}/dobot/suction/${suctionEndpoint}`, {
      method: 'POST'
    })
    .then(response => {
      if (response.ok) {
        setSuction(newState);
      } else {
        response.json().then(err => {
          window.alert(`Erro: ${err.error}`);
          setSuction(suction);
        });
      }
    })
    .catch(error => {
      console.error("Erro na sucção:", error);
      window.alert("Falha ao comunicar com o Dobot");
      setSuction(suction);
    });
  };

  return (
    <PageContainer>
      <nav><Header /> </nav>
      <div className="topo">
        <h1>Adicionar novo bin</h1>
      </div>
      
      <div className="ponto">
        <p>ID do Medicamento:</p>
        <input 
          type="number" 
          value={medicamentoId} 
          onChange={handleIdChange}
          placeholder="Digite o ID"
        />
      </div>

      <button className="btn-add" onClick={addPonto}>
        Adicionar ponto
      </button>

      <section className="checkboxes">
        <div className="direcao-movimentos">
          <input 
            type='checkbox' 
            checked={moveL} 
            onChange={selectMove} 
          /> 
          <label>Move L</label>
          <input 
            type='checkbox' 
            checked={!moveL} 
            onChange={() => setMoveL(false)} 
          /> 
          <label>Move J</label>
        </div>

        <div className="succao">
          <input 
            type='checkbox' 
            checked={suction} 
            onChange={selectSuction} 
          /> 
          <label>Sucção</label>
        </div>
      </section>

      {pontos.length > 0 && (
        <div className="pontos-adicionados">
          <h3>Pontos Capturados ({pontos.length})</h3>
          {pontos.map(ponto => (
            <div key={ponto.ponto}>
              Ponto {ponto.ponto}: 
              X: {ponto.x.toFixed(2)}, 
              Y: {ponto.y.toFixed(2)}, 
              Z: {ponto.z.toFixed(2)},
              R: {ponto.r.toFixed(2)}, 
              Movimento: {ponto.movimento}, 
              Sucção: {ponto.suctionCup}
            </div>
          ))}
        </div>
      )}

      <section className="existing-bins">
        <h3>Bins Cadastrados</h3>
        {existingBins.map(bin => (
          <div key={bin.medicamento} className="bin-item">
            <span>Medicamento {bin.medicamento}</span>
            {bin.medicamento > 5 && (
              <button onClick={() => deleteMedicamento(bin.medicamento)}>
                Excluir
              </button>
            )}
          </div>
        ))}
      </section>

      <button className="btn-send" style={{ marginBottom: "1rem", marginTop: "-0.5remw" }} onClick={sendBin}>
        Cadastrar bin
      </button>
    </PageContainer>
  )
}

export default AdicionarBin;