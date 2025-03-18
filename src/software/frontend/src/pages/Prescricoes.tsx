import styled from 'styled-components';
import Footer from '../components/Footer';
import Navbar from '../components/sidebar/Navbar';
import { HiOutlineClock } from "react-icons/hi2";
//import axios from 'axios';

const PrescricoesContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .prescricoes {
    width: 70%;
    margin: 20px;
    gap: 1rem;
  }

  > nav {
    width: 100%;
  }

  > h1 {
    color: #34495E;
    font-size: 64px;
    font-weight: 900;
    
  }

  > footer {
    width: 100%; 
  }

`;

const CardBox = styled.div`
  background-color: #34495E;
  border: 1px solid #ddd;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 8px;
  width: 100%;
  color: #FFF;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  .infos-card-prescricao {
    margin-bottom: 10px;
  }

  .infos-card-prescricao span {
    font-size: 40px;
    font-weight: 900;
  }

  .infos-card-prescricao p {
    font-size: 16px;
    font-weight: 400;
    margin: .5rem 1rem;
  }

  .interacao-card-prescricao {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .botoes-prescricao {
    width: 40%;
    display: flex;
    justify-content: space-around;
  }

  .botoes-prescricao button {
    background-color: #2ECC71;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    width: 30%;
  }

  .botoes-prescricao button:hover {
    background-color: #26dd72;
  }
`;

const CardComponent = ({ paciente, id, medico, data, horario }) => {
  return (
    <CardBox>
      <div className="infos-card-prescricao">
        <span>{paciente}</span>
        <p>ID: {id}</p>
        <p>Médico: {medico}</p>
        <p><HiOutlineClock /> {data}, {horario} </p>
      </div>
      <div className="botoes-prescricao">
        <button onClick={() => window.alert('Prescrição aprovada')} className="approve-button">Aprovar</button>
        <button onClick={() => window.location.href = '/verificacao'} className="review-button">Alterar</button>
      </div>

    </CardBox>
  )
}


const Prescricoes = () => {
  return (
    <PrescricoesContainer>
      <nav><Navbar /></nav>
      <h1>Prescrições pendentes</h1>
      <section className="prescricoes">
        <CardComponent paciente="Ana Maria" id="HC123456" medico="Mariana Oliveira" data="24/02/2025" horario="16:40:31" />
        <CardComponent paciente="Amanda Costa" id="HC654321" medico="Sergio Melo" data="24/02/2025" horario="16:32:45" />
        <CardComponent paciente="Anny Maia" id="HC817680" medico="Sergio Melo" data="24/02/2025" horario="16:20:17" />
      </section>
      <Footer />
    </PrescricoesContainer>
  );
}



export default Prescricoes;
