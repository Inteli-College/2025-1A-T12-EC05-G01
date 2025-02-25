import styled from 'styled-components';
import Footer from '../components/Footer';

const Dashboard = () => {
  return (
    <StyledWrapper>
      <nav>Navbar a ser implementada posteriormente</nav>
      <div className="topo-dash">
        <h2>Métricas de acompanhamento</h2>
        <p>Lorem ipsum dolor sit amet. Ut autem suscipit At beatae molestias est autem beatae aut libero veritatis sit placeat nihil et inventore eius.</p>
      </div>

      <section className="cards-fitas">
        <h3>Fitas montadas</h3>
        <div className="card-fita">
          <img src="" alt="imagem do remédio" />
          <div className="infos-card-fita">
            <span>Nome do paciente</span>
            <p>informações da fita</p>
          </div>
        </div>

        <div className="card-fita">
          <img src="" alt="imagem do remédio" />
          <div className="infos-card-fita">
            <span>Nome do paciente</span>
            <p>informações da fita</p>
          </div>
        </div>

        <div className="card-fita">
          <img src="" alt="imagem do remédio" />
          <div className="infos-card-fita">
            <span>Nome do paciente</span>
            <p>informações da fita</p>
          </div>
        </div>

        <div className="card-fita">
          <img src="" alt="imagem do remédio" />
          <div className="infos-card-fita">
            <span>Nome do paciente</span>
            <p>informações da fita</p>
          </div>
        </div>
      </section>

      <section className="cards-fitas">
        <h3>Fitas em montagem</h3>
        <div className="card-fita">
          <img src="" alt="imagem do remédio" />
          <div className="infos-card-fita">
            <span>Nome do paciente</span>
            <p>informações da fita</p>
          </div>
        </div>

        <div className="card-fita">
          <img src="" alt="imagem do remédio" />
          <div className="infos-card-fita">
            <span>Nome do paciente</span>
            <p>informações da fita</p>
          </div>
        </div>

        <div className="card-fita">
          <img src="" alt="imagem do remédio" />
          <div className="infos-card-fita">
            <span>Nome do paciente</span>
            <p>informações da fita</p>
          </div>
        </div>

        <div className="card-fita">
          <img src="" alt="imagem do remédio" />
          <div className="infos-card-fita">
            <span>Nome do paciente</span>
            <p>informações da fita</p>
          </div>
        </div>
      </section>

      <section className="grafico">
        <h3>Taxa de sucesso</h3>
        <img src="" alt="" />
      </section>

      <section className="montagens">
        <h3>Últimas montagens</h3>
        <div className="infos-lista-montagem">
          <p>id da montagem</p>
          <p>Status</p>
          <p>horário de finalização da montagem</p>
        </div>

        <ul className="lista-montagens">
          <li>
            <p>id da montagem</p>
            <select>
              <option>Status</option>
              <option>Concluída</option>
              <option>Aguardando aprovação</option>
              <option>Montagem com erro</option>
            </select>
            <p>horário de finalização da montagem</p>
          </li>

          <li>
            <p>id da montagem</p>
            <select>
              <option>Status</option>
              <option>Concluída</option>
              <option>Aguardando aprovação</option>
              <option>Montagem com erro</option>
            </select>
            <p>horário de finalização da montagem</p>
          </li>

          <li>
            <p>id da montagem</p>
            <select>
              <option>Status</option>
              <option>Concluída</option>
              <option>Aguardando aprovação</option>
              <option>Montagem com erro</option>
            </select>
            <p>horário de finalização da montagem</p>
          </li>

          <li>
            <p>id da montagem</p>
            <select>
              <option>Status</option>
              <option>Concluída</option>
              <option>Aguardando aprovação</option>
              <option>Montagem com erro</option>
            </select>
            <p>horário de finalização da montagem</p>
          </li>

          <li>
            <p>id da montagem</p>
            <select>
              <option>Status</option>
              <option>Concluída</option>
              <option>Aguardando aprovação</option>
              <option>Montagem com erro</option>
            </select>
            <p>horário de finalização da montagem</p>
          </li>
        </ul>
      </section>

      <Footer />
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .topo-dash {
    text-align: center;
    margin: 20px 0;
  }

  .cards-fitas, .grafico, .montagens {
    margin: 20px;
  }

  .card-fita, .infos-lista-montagem, .lista-montagens {
    margin-bottom: 20px;
  }

  .infos-card-fita {
    margin-top: 10px;
  }
`;

export default Dashboard;
