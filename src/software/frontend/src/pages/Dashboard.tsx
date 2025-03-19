import styled from 'styled-components';
import Footer from '../components/Footer';
import Header from '../components/sidebar/Navbar';
import Chart from '../components/Chart';
import axios from 'axios';
import { useEffect, useState } from 'react';

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
  
  > footer {width: 100%; margin-top: 1.5rem;}

  h3 {
    margin: 3rem 0 0 0;
    color: #34495E;
    font-size: 36px;
    font-weight: 900;
   }

  .secao-atividades {
    width: 80%;
    
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

  .card-logs {
    width: 100%;
    margin-top: 1rem;
    background-color: #34495E;
    border-radius: 15px;
    padding: 2rem;
    overflow: auto;
    max-height: 420px;
  }

  .logs {
    width: 80%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin: 1rem;
    margin-bottom: 2.5rem;
  }

  .volume-fitas {
    width: 80%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .cards {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
  }
`;

interface CardComponentProps {
  paciente: string;
  id: string;
  data: string;
  horario: string;
  icon: React.ReactNode;
}

const CardComponent: React.FC<CardComponentProps> = ({ paciente, id, data, horario, icon }) => {
  return (
    <CardBox>
      {icon}
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

interface TableComponentProps {
  paciente: string;
  status: string;
  tratamento: string;
}

const TableComponent: React.FC<TableComponentProps> = ({ paciente, status, tratamento }) => {
  return (
    <TableBox>
      <p>{paciente}</p>
      <p>{status}</p>
      <p>{tratamento}</p>
    </TableBox>
  )
}

const LogBox = styled.div`
  width: 100%;
  background-color: #FFF;
  display: flex;
  justify-content: space-between;
  border-radius: 10px;
  margin-bottom: 1rem;

  p {
    margin: 1rem;
  }
`;

const LogComponent = ({ log }) => {
  return (
    <LogBox>
      <p>{log}</p>
    </LogBox>
  )
}

const CardBox = styled.div`
  width: 30%;
  gap: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  background-color: #34495E;
  border-radius: 15px;
  padding: 1rem .5rem;

  span {
    color: ${(props) => props.color};
    text-align: center;
    font-family: Montserrat;
    font-size: 32px;
    font-weight: 900;
  }

  .card-interno {
    width: 90%;
    height: 5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;

    background-color: #ECF0F1;
    border-radius: 15px;
  }
`;

const CardComponent = ({ color, title, quantidade }) => {
  return (
    <CardBox color={ color } >
      <span>{title}</span>
      <div className="card-interno">
        <span>{quantidade}</span>
      </div>
    </CardBox>
  )

}


function Dashboard() {
  // LÓGICA PARA PUXAR OS LOGS DO BANCO
  // const [listOfLogs, setListOfLogs] = useState([]);

  // useEffect(() => {
  //   axios.get('/logs').then((response) => {
  //     setListOfLogs(response.data)
  //   })
  // }, [])

  return (
    <BodyDashboard>
      <nav><Header /></nav>
      <div className="topo-dash">
        <h1>Dashboard</h1>
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

      <section className="logs">
        <h3>Logs do robô</h3>
        <div className="card-logs">
          {/* FUNÇÃO PARA PUXAR OS LOGS DO BANCO {listOfLogs.map((value, key) => {
              return <LogComponent log={value} />
            })} */}
          <LogComponent log='robô em posição de home' />
          <LogComponent log='fita finalizada com sucesso' />
          <LogComponent log='medicamento 1 separado' />
          <LogComponent log='medicamento 1 bipado' />
          <LogComponent log='falha ao bipar medicamento 1' />
          <LogComponent log='medicamento 2 separado' />
          <LogComponent log='medicamento 2 coletado' />
          <LogComponent log='medicamento 2 bipado' />
        </div>
      </section>

      <section className="volume-fitas">
        <h3>Acompanhamento de volume das fitas</h3>
        <div className="cards">
          <CardComponent color='#2ECC71' title='Fitas montadas' quantidade={192} />
          <CardComponent color='#E67E22' title='Fitas em espera' quantidade={25} />
          <CardComponent color='#E9B78A' title='Tempo estimado' quantidade='2h45min' />
        </div>
      </section>


      <footer><Footer /></footer>
    </BodyDashboard>
  );
};


export default Dashboard;
