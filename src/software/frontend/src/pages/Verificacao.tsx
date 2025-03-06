import styled from 'styled-components';
import Footer from '../components/Footer';
import Navbar from '../components/sidebar/Navbar';
import axios from 'axios';

const Verificacao = () => {
  const quantidade = 1

  return (
    <div className='verificacao'>
      <nav><Navbar /></nav>
      <StyledWrapper>
      <section className="fitas">
      <h1>Fitas <br /> Montadas</h1>
        <div className="card-fita">
          <div className="infos-card-fita">
            <div className="paciente-fita">
            <span>Maria Oliveira</span>
            <p>24/02/2025, 16:00</p>
            </div>
            <button>Iniciar selagem</button>
          </div>
          <div className="interacao-card-fita">
            <ul>
              <li>
                <span>Paracetamol 750mg</span>
                <p>Quantidade: {quantidade}</p>
              </li>
              <li>
                <span>Dipirona 1g</span>
                <p>Quantidade: {quantidade}</p>
              </li>
            </ul>
          </div>
        </div>

        <div className="card-fita">
          <div className="infos-card-fita">
            <div className="paciente-fita">
            <span>José Santos</span>
            <p>24/02/2025, 16:05</p>
            </div>
            <button>Iniciar selagem</button>
          </div>
          <div className="interacao-card-fita">
            <ul>
              <li>
                <span>Loratadina 10mg</span>
                <p>Quantidade: {quantidade}</p>
              </li>
              <li>
                <span>Dipirona 1g</span>
                <p>Quantidade: {quantidade}</p>
              </li>
              <li>
                <span>Miosan 10mg</span>
                <p>Quantidade: {quantidade}</p>
              </li>
            </ul>
          </div>
        </div>

        <div className="card-fita">
          <div className="infos-card-fita">
            <div className="paciente-fita">
            <span>Ana Silva</span>
            <p>24/02/2025, 16:10</p>
            </div>
            <button>Iniciar selagem</button>
          </div>
          <div className="interacao-card-fita">
            <ul>
              <li>
                <span>Sertralina 500mg</span>
                <p>Quantidade: {quantidade}</p>
              </li>
              <li>
                <span>Paracetamol 750mg</span>
                <p>Quantidade: {quantidade}</p>
              </li>
            </ul>
          </div>
        </div>

      </section>

      <Footer />
      </StyledWrapper>
    </div>

  );
}

const StyledWrapper = styled.div`
  .fitas {
    margin: 20px;

    width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.fitas h1 {
    text-align: left;
    width: 70%;
    color: #2C3E50;
    font-weight: 1000;
}

.card-fita {
    border: 1px solid #ddd;
    padding: 1.5rem 2rem;
    margin-bottom: 15px;
    border-radius: 12px;
    background-color: #34495E;

    width: 70%;
}


.infos-card-fita {
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.paciente-fita {
    display: flex;
    flex-direction: column;
    color: #FFF;
}

.paciente-fita span {
    font-weight: 400;
    font-size: 2rem;
}

.paciente-fita p {
    font-weight: 200;
    font-size: 1rem;
    margin: 0;
}

.interacao-card-fita ul {
    list-style-type: none;
    padding: 0;
    color: #323848;
}

.interacao-card-fita li {
    margin-bottom: 10px;
    background-color: #E9B78A;
    padding: .2rem 1rem;
    border-radius: 12px;

}

.interacao-card-fita li span {
    font-size: 1.5rem;
}

.interacao-card-fita li p {
    font-size: 1rem;
    margin: 0;
}

button {
    background-color: #2ECC71;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    height: 100%;

    font-size: 1.3rem;
}

button:hover {
    background-color: #26dd72;
}
`;

export default Verificacao;
