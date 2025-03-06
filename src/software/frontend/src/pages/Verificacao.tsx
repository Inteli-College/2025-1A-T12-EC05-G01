import styled from 'styled-components';
import Footer from '../components/Footer';
import Navbar from '../components/sidebar/Navbar';
import axios from 'axios';

const Verificacao = () => {
  return (
    <StyledWrapper>
      <nav><Navbar /></nav>
      <h1>Verificação de medicamentos</h1>

      <section className="prescricoes">
        <div className="card-prescricao">
          <div className="infos-card-prescricao">
            <span>Nome do paciente</span>
            <button>Finalizar</button>
          </div>
          <div className="interacao-card-prescricao">
            <ul>
              <li>
                <p>nome do princípio ativo</p>
                <p>dosagem do medicamento</p>
                <p>Aprovar medicamento</p>
              </li>
              <li>
                <p>nome do princípio ativo</p>
                <p>dosagem do medicamento</p>
                <input type="checkbox" />
              </li>
              <li>
                <p>nome do princípio ativo</p>
                <p>dosagem do medicamento</p>
                <input type="checkbox" />
              </li>
            </ul>
          </div>
        </div>

        <div className="card-prescricao">
          <div className="infos-card-prescricao">
            <span>Nome do paciente</span>
            <button>Finalizar</button>
          </div>
          <div className="interacao-card-prescricao">
            <ul>
              <li>
                <p>nome do princípio ativo</p>
                <p>dosagem do medicamento</p>
                <p>Aprovar medicamento</p>
              </li>
              <li>
                <p>nome do princípio ativo</p>
                <p>dosagem do medicamento</p>
                <input type="checkbox" />
              </li>
              <li>
                <p>nome do princípio ativo</p>
                <p>dosagem do medicamento</p>
                <input type="checkbox" />
              </li>
              <li>
                <p>nome do princípio ativo</p>
                <p>dosagem do medicamento</p>
                <input type="checkbox" />
              </li>
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .prescricoes {
    margin: 20px;
  }

  .card-prescricao {
    border: 1px solid #ddd;
    padding: 15px;
    margin-bottom: 15px;
    border-radius: 8px;
  }

  .infos-card-prescricao {
    margin-bottom: 10px;
  }

  .interacao-card-prescricao ul {
    list-style-type: none;
    padding: 0;
  }

  .interacao-card-prescricao li {
    margin-bottom: 10px;
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

export default Verificacao;
