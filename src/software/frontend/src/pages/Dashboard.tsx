import styled from 'styled-components';
import Footer from '../components/Footer';
import Header from '../components/sidebar/Navbar';
import { HiCheckCircle, HiOutlineClock } from "react-icons/hi2";
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
          <CardComponent paciente="João Silva" id="HC123456" data="24/02/2025" horario="16:30:45" />
          <CardComponent paciente="João Silva" id="HC123456" data="24/02/2025" horario="16:30:45" />
          <CardComponent paciente="João Silva" id="HC123456" data="24/02/2025" horario="16:30:45" />
          <CardComponent paciente="João Silva" id="HC123456" data="24/02/2025" horario="16:30:45" />
          <CardComponent paciente="João Silva" id="HC123456" data="24/02/2025" horario="16:30:45" />
          <CardComponent paciente="João Silva" id="HC123456" data="24/02/2025" horario="16:30:45" />
          <CardComponent paciente="João Silva" id="HC123456" data="24/02/2025" horario="16:30:45" />
          <CardComponent paciente="João Silva" id="HC123456" data="24/02/2025" horario="16:30:45" />
        </div>
      </div>

      <div className="fitas-section">
        <h3>Fitas Montadas</h3>
        <div className="fitas">
          <CardComponent paciente="João Silva" id="HC123456" data="24/02/2025" horario="16:30:45" />
          <CardComponent paciente="João Silva" id="HC123456" data="24/02/2025" horario="16:30:45" />
          <CardComponent paciente="João Silva" id="HC123456" data="24/02/2025" horario="16:30:45" />
          <CardComponent paciente="João Silva" id="HC123456" data="24/02/2025" horario="16:30:45" />
          <CardComponent paciente="João Silva" id="HC123456" data="24/02/2025" horario="16:30:45" />
          <CardComponent paciente="João Silva" id="HC123456" data="24/02/2025" horario="16:30:45" />
          <CardComponent paciente="João Silva" id="HC123456" data="24/02/2025" horario="16:30:45" />
          <CardComponent paciente="João Silva" id="HC123456" data="24/02/2025" horario="16:30:45" />
        </div>
      </div>

      
      <footer><Footer /></footer>
    </BodyDashboard>
  );
};


export default Dashboard;
