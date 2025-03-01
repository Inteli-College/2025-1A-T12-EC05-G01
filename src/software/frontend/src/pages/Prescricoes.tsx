import styled from 'styled-components';
import Footer from '../components/Footer';
import Navbar from '../components/sidebar/Navbar'

const Prescricoes = () => {
  return (
    <StyledWrapper>
      <nav><Navbar /></nav>
      <h1>Prescrições pendentes</h1>

      <section className="prescricoes">
        <div className="card-prescricao">
          <div className="infos-card-prescricao">
            <span>Nome do paciente</span>
            <p>prescrição</p>
          </div>
          <div className="interacao-card-prescricao">
            <span>A prescrição está adequada?</span>
            <div className="botoes-prescricao">
              <button>Aprovar</button>
              <button onClick={() => window.location.href='/verificacao'}>Aprovar com ressalva</button>
            </div>
          </div>
        </div>

        <div className="card-prescricao">
          <div className="infos-card-prescricao">
            <span>Nome do paciente</span>
            <p>prescrição</p>
          </div>
          <div className="interacao-card-prescricao">
            <span>A prescrição está adequada?</span>
            <div className="botoes-prescricao">
              <button>Aprovar</button>
              <button onClick={() => window.location.href='/verificacao'}>Aprovar com ressalva</button>
            </div>
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

  .interacao-card-prescricao {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .botoes-prescricao button {
    background-color: #2ECC71;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
  }

  .botoes-prescricao button:hover {
    background-color: #26dd72;
  }
`;

export default Prescricoes;
