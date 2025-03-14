import styled from 'styled-components';
import Footer from '../components/Footer';
import Header from '../components/sidebar/Navbar';
import { HiCheckCircle, HiOutlineClock } from "react-icons/hi2";
import Chart from '../components/Chart';
//import axios from 'axios';

const BodyDashboard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  .topo-dash {
    display: flex;
    align-itens: flex-start;
    width: 80%;

    color: #34495E;
    font-size: 28px;
    font-weight: 900;
  }

  > nav {width: 100%;}
  
  > footer {width: 100%;}

  .fitas-section {
    width: 80%;
  }
  
  .fitas-section h3 {
    margin: 0;
    color: #34495E;
    font-size: 36px;
    font-weight: 900;
  }

  .fitas {
    width: 100%;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }

  .secao-atividades {
    width: 80%;
    
  }

  .secao-atividades h3 {
    margin: 3rem 0 0 0;
    color: #34495E;
    font-size: 36px;
    font-weight: 900;
  }

  .atividades {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin: 1rem;
    margin-bottom: 2.5rem;
  }

  .chart {
    width: 40%;
    background-color: #34495E;
    border-radius: 15px;
    padding: 2rem;
  }

  .tabela {
    width: 40%;
    background-color: #34495E;
    border-radius: 15px;
    padding: 2rem;
    overflow: auto;
    max-height: 420px;
  }

  .labels {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  .labels span {
    color: #FFF;
    font-size: 24px;
    font-weight: 900;
  }
`;

const CardBox = styled.div`
  background-color: #34495E;
  width: 20%;
  border-radius: 15px;
  padding: 1rem;
  gap: 2.5rem;
  color: white;
  margin: 1rem;

  display: flex;
  flex-direction: row;

  > svg {
    width: 20%;
    height: 20%; 
    color: #4D925B;
    margin-left: 1rem;
  }
  
  .infos span {
    font-size: 32px;
    font-weight: 900;
    margin: 0;
  }

  .infos p {
    font-size: 16px;
    font-weight: 400;
    margin: .2rem;
    display: flex;
    align-items: center;
  }
`;

const CardComponent = ({ paciente, id, data, horario }) => {
  return (
    <CardBox>
      <HiCheckCircle />
      <section className="infos">
        <span>{paciente}</span>
        <p>ID: {id}</p>
        <p><HiOutlineClock /> {data}, {horario} </p>
      </section>
    </CardBox>
  )
};

const TableBox = styled.div`
  width: 100%;
  background-color: #FFF;
  display: flex;
  justify-content: space-between;
  border-radius: 10px;
  margin-bottom: 1rem;

  p {
    margin: 1rem;
  }
  
`

const TableComponent = ({ paciente, status, tratamento }) => {
  return (
    <TableBox>
      <p>{paciente}</p>
      <p>{status}</p>
      <p>{tratamento}</p>
    </TableBox>
  )
}


const Dashboard = () => {
  return (
    <BodyDashboard>
      <nav><Header /></nav>
      <div className="topo-dash">
        <h1>Dashboard</h1>
      </div>
      <div className="fitas-section">
        <h3>Fitas Montadas</h3>
        <div className="fitas">
          <CardComponent paciente="Luísa de Bastos" id="HC123456" data="24/02/2025" horario="16:30:45" />
          <CardComponent paciente="Henrique Ribeiro" id="HC123456" data="24/02/2025" horario="16:30:45" />
          <CardComponent paciente="Bruna Caldas" id="HC123456" data="24/02/2025" horario="16:30:45" />
          <CardComponent paciente="Matheus Pacheco" id="HC123456" data="24/02/2025" horario="16:30:45" />
          <CardComponent paciente="Amanda Prado" id="HC123456" data="24/02/2025" horario="16:30:45" />
          <CardComponent paciente="Igor Magalhães" id="HC123456" data="24/02/2025" horario="16:30:45" />
          <CardComponent paciente="Letícia Nogueira" id="HC123456" data="24/02/2025" horario="16:30:45" />
          <CardComponent paciente="Lucas Dornelles" id="HC123456" data="24/02/2025" horario="16:30:45" />
        </div>
      </div>

      <div className="fitas-section">
        <h3>Fitas Montadas</h3>
        <div className="fitas">
          <CardComponent paciente="Marina Albuquerque" id="HC123456" data="24/02/2025" horario="16:30:45" />
          <CardComponent paciente="Felipe Ventura" id="HC123456" data="24/02/2025" horario="16:30:45" />
          <CardComponent paciente="Júlia Sampaio" id="HC123456" data="24/02/2025" horario="16:30:45" />
          <CardComponent paciente="Caio Figueiredo" id="HC123456" data="24/02/2025" horario="16:30:45" />
          <CardComponent paciente="Larissa Fontes" id="HC123456" data="24/02/2025" horario="16:30:45" />
          <CardComponent paciente="Gabriel Mendonça" id="HC123456" data="24/02/2025" horario="16:30:45" />
          <CardComponent paciente="Rafaela Andrade" id="HC123456" data="24/02/2025" horario="16:30:45" />
          <CardComponent paciente="Diego Valença" id="HC123456" data="24/02/2025" horario="16:30:45" />
        </div>
      </div>

      <section className="secao-atividades">
        <h3>Acompanhamento de atividades</h3>
        <div className="atividades">
          <div className="chart">
            <Chart />
          </div>

          <div className="tabela">
            <div className="labels">
              <span>Paciente</span>
              <span>Status</span>
              <span>Tratamento</span>
            </div>
            <TableComponent paciente="Joana Maria" status="Separado" tratamento="Lorem Ipsum" />
            <TableComponent paciente="Ronald Alves" status="Separado" tratamento="Lorem Ipsum" />
            <TableComponent paciente="Helena Maria Santana" status="Separado" tratamento="Lorem Ipsum" />
            <TableComponent paciente="Alberto Gomes" status="Separado" tratamento="Lorem Ipsum" />
            <TableComponent paciente="Sophia Marques" status="Separado" tratamento="Lorem Ipsum" />
            <TableComponent paciente="Renata Oliveira" status="Separado" tratamento="Lorem Ipsum" />
          </div>
        </div>
      </section>

      <footer><Footer /></footer>
    </BodyDashboard>
  );
};


export default Dashboard;
