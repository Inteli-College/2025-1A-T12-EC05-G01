import styled from "styled-components";
import Header from "../components/sidebar/Navbar";
import { useState } from 'react'

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
    font-size: clamp(20px, 5vw, 28px);;
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
  
  h1 {
  
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

`;

let DOBOT_URL = "http://localhost:5000";

function AdicionarBin() {
  const [moveL, setMoveL] = useState(false);
  const [suction, setSuction] = useState(false);
  const [medicamentoId, setMedicamentoId] = useState('');
  const [pontos, setPontos] = useState(null);

  const addPonto = () => {
    fetch(`${DOBOT_URL}/dobot/posicao`)
      .then(response => response.json())
      .then(data => {
        if (data && data.pontos) {
          const { x, y, z } = data.pontos;
          setPontos({ x, y, z });
          window.alert("Ponto adicionado com sucesso!");
          console.log("Posição do Dobot:", x, y, z);
        } else {
          console.error("Dados de pontos inválidos:", data);
        }
      })
      .catch(error => {
        console.error("Erro ao obter posição do Dobot:", error);
        window.alert("Erro ao obter posição do Dobot");
      });
  };

  const sendBin = () => {
    if (!medicamentoId) {
      window.alert("Por favor, insira o ID do medicamento.");
      return;
    }
    
    if (!pontos) {
      window.alert("Por favor, adicione um ponto.");
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

    fetch(`${DOBOT_URL}/dobot/bin/adicionar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        medicamento: id,
        pontos: pontos
      }),
    })
      .then(response => {
        if (response.ok) {
          window.alert("Bin cadastrado com sucesso!");
          setPontos(null);
          setMedicamentoId('');
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

  const selectMove = () => {
    setMoveL(!moveL)
  }

  const selectSuction = () => {
    setSuction(!suction)
  }

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
          onChange={(e) => setMedicamentoId(e.target.value)}
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

      <button className="btn-send" onClick={sendBin}>
        Cadastrar bin
      </button>

    </PageContainer>
  )
}

export default AdicionarBin;