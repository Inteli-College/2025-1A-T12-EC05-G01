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
    align-items: flex-start;
    width: 90%;
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

    color: #ECF0F1;
    font-size: clamp(20px, 5vw, 28px);;
    font-weight: 900;
  }

  > button:hover {
    background-color:#2C3E50; 
  }

  .coordenadas {
    width: 90%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center; 
    flex-wrap: wrap;
    gap: 1rem;
    margin: 2rem 0;
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
    gap: .5rem;
  }

  .direcao-movimentos label {
    padding: 1rem;
  }

`;


function AdicionarBin() {
  const addPonto = () => {
    window.alert("Ponto adicionado com sucesso!")
  }

  const [moveL, setMoveL] = useState(false);
  const [suction, setSuction] = useState(false);

  const selectMove = () => {
    setMoveL(!moveL)
  }

  const selectSuction = () => {
    setSuction(!suction)
    window.alert(suction)
  }

  return (
    <PageContainer>
      <nav><Header /> </nav>
      <div className="topo">
        <h1>Adicionar novo bin</h1>
      </div>
      <button>Instruções</button>

      <div className="coordenadas">
        <div className="ponto">
          <p>x: </p> <input></input>
        </div>

        <div className="ponto">
          <p>y: </p> <input></input>
        </div>

        <div className="ponto">
          <p>z: </p> <input></input>
        </div>

        <div className="ponto">
          <p>r: </p> <input></input>
        </div>
      </div>

      <button className="btn-add" onClick={addPonto} >Adicionar ponto</button>

      <section className="checkboxes">
        <div className="direcao-movimentos">
          <input type='checkbox' checked={moveL} onChange={selectMove} /> <label>Move L</label>
          <input type='checkbox' checked={!moveL} onChange={() => setMoveL(false)} /> <label>Move J</label>
        </div>

        <div className="succao">
          <input type='checkbox' checked={suction} onChange={selectSuction} /> <label>Sucção</label>
        </div>
      </section>

    </PageContainer>
  )
}

export default AdicionarBin;
