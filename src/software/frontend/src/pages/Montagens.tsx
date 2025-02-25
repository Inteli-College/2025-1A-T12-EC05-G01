import styled from 'styled-components';
import Footer from '../components/Footer';

const Montagens = () => {
  return (
    <StyledWrapper>
      <nav>Navbar a ser implementada posteriormente</nav>

      <div className="topo-montagens">
        <h1>Acompanhamento de montagens</h1>
        <button>Pausar operação ||</button>
      </div>

      <section className="montagens">
        <div className="card-montagem">
          <p>id da montagem</p>
          <p>Prescrição</p>
        </div>

        <div className="card-montagem">
          <p>id da montagem</p>
          <p>Prescrição</p>
        </div>

        <div className="card-montagem">
          <p>id da montagem</p>
          <p>Prescrição</p>
        </div>
      </section>

      <section className="acompanhamento-robo">
        <h2>Acompanhe o funcionamento do braço mecânico</h2>
        <div className="logs-robo">
          <p>Última atividade do dobot</p>
          <p>Penúltima atividade do robô</p>
          <p>Demais atividades do robô</p>
        </div>
      </section>

      <Footer />
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .topo-montagens {
    text-align: center;
    margin: 20px 0;
  }

  .montagens, .acompanhamento-robo {
    margin: 20px;
  }

  .card-montagem {
    border: 1px solid #ddd;
    padding: 15px;
    margin-bottom: 15px;
    border-radius: 8px;
  }

  .logs-robo {
    margin-top: 10px;
  }

  button {
    background-color: #2ECC71;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
  }

  button:hover {
    background-color: #26dd72;
  }
`;

export default Montagens;
