import styled from 'styled-components';
import Footer from '../components/Footer';
import Header from '../components/sidebar/Navbar';
import Chart from '../components/Chart';
import Section from '../components/common/Section';
import Card from '../components/common/Card';

const BodyDashboard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  .content-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 70px; /* Added to account for fixed navbar */
  }

  .topo-dash {
    display: flex;
    align-items: flex-start;
    width: 90%;
    max-width: 1200px;
    padding: 0 15px;
    color: #34495E;
    font-size: clamp(20px, 5vw, 28px);
    font-weight: 900;
  }

  > nav {width: 100%;}
  
  > footer {width: 100%; margin-top: 1.5rem;}

  h3 {
    margin: 3rem 0 0 0;
    color: #34495E;
    font-size: clamp(24px, 5vw, 36px);
    font-weight: 900;
   }

  .secao-atividades {
    width: 90%;
    max-width: 1200px;
  }

  .atividades {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 1rem 0;
    margin-bottom: 2.5rem;
    gap: 20px;
    
    @media (max-width: 768px) {
      flex-direction: column;
      align-items: center;
    }
  }

  .chart {
    width: 100%;
    background-color: #34495E;
    border-radius: 15px;
    padding: 2rem;
    
    @media (min-width: 769px) {
      width: 48%;
    }
  }

  .tabela {
    width: 100%;
    background-color: #34495E;
    border-radius: 15px;
    padding: 2rem;
    overflow: auto;
    max-height: 420px;
    
    @media (min-width: 769px) {
      width: 48%;
    }
  }

  .labels {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
    
    @media (max-width: 480px) {
      font-size: 18px;
    }
  }

  .labels span {
    color: #FFF;
    font-size: clamp(16px, 4vw, 24px);
    font-weight: 900;
  }

  .card-logs {
    width: 100%;
    margin-top: 1rem;
    background-color: #34495E;
    border-radius: 15px;
    padding: 1.5rem;
    overflow: auto;
    max-height: 420px;
  }

  .logs {
    width: 90%;
    max-width: 1200px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin: 1rem 0;
    margin-bottom: 2.5rem;
  }

  .volume-fitas {
    width: 90%;
    max-width: 1200px;
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
    flex-wrap: wrap;
    gap: 20px;
  }
`;

const TableBox = styled.div`
  width: 100%;
  background-color: #FFF;
  display: flex;
  justify-content: space-between;
  border-radius: 10px;
  margin-bottom: 1rem;
  flex-wrap: wrap;

  p {
    margin: 1rem;
    flex: 1;
    min-width: 80px;
    color: #34495E; /* Added text color for visibility */
    font-weight: 500;
    
    @media (max-width: 480px) {
      font-size: 14px;
      margin: 0.5rem;
    }
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
    color: #34495E; /* Added text color for visibility */
    font-weight: 500;
    
    @media (max-width: 480px) {
      font-size: 14px;
      margin: 0.5rem;
    }
  }
`;

interface LogComponentProps {
  log: string;
}

const LogComponent: React.FC<LogComponentProps> = ({ log }) => {
  return (
    <LogBox>
      <p>{log}</p>
    </LogBox>
  )
}

const CardBox = styled.div`
  width: 30%;
  min-width: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #34495E;
  border-radius: 15px;
  padding: 1rem .5rem;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    width: 80%;
  }

  span {
    color: ${(props) => props.color};
    text-align: center;
    font-family: Montserrat;
    font-size: clamp(20px, 5vw, 32px);
    font-weight: 900;
  }

  .card-interno {
    width: 90%;
    height: 5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ECF0F1;
    border-radius: 15px;
  }
`;

interface CardComponentProps {
  color: string;
  title: string;
  quantidade: string | number;
}

const CardComponent: React.FC<CardComponentProps> = ({ color, title, quantidade }) => {
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
      <div className="content-wrapper">
        <div className="topo-dash">
          <h1>Dashboard</h1>
        </div>

        <Section title="Acompanhamento de atividades">
          <div className="atividades">
            <Card className="chart">
              <Chart />
            </Card>

            <Card className="tabela">
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
            </Card>
          </div>
        </Section>

        <Section title="Logs do robô">
          <Card className="card-logs">
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
          </Card>
        </Section>

        <Section title="Acompanhamento de volume das fitas">
          <div className="cards">
            <CardComponent color='#2ECC71' title='Fitas montadas' quantidade={192} />
            <CardComponent color='#E67E22' title='Fitas em espera' quantidade={25} />
            <CardComponent color='#E9B78A' title='Tempo estimado' quantidade='2h45min' />
          </div>
        </Section>
      </div>
      <footer><Footer /></footer>
    </BodyDashboard>
  );
}

export default Dashboard;
