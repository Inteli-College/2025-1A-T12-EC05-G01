import styled from 'styled-components';
import Footer from '../components/Footer';
import Navbar from '../components/sidebar/Navbar';
import axios from 'axios';

const Estoque = () => {
  return (
    <StyledWrapper>
      <nav><Navbar /></nav>
      <div className="topo-estoque">
        <h2>Gerenciamento de estoque</h2>
        <button>Adicionar medicamento <span>+</span></button>
      </div>

      <section className="medicamentos-estoque">
        <div className="card-medicamento">
          <img src="" alt="foto do medicamento" />
          <div className="infos-card-medicamento">
            <span>Nome do medicamento</span>
            <p>Unidades em estoque: </p>
            <p>Data da última aquisição: </p>
          </div>
        </div>

        <div className="card-medicamento">
          <img src="" alt="foto do medicamento" />
          <div className="infos-card-medicamento">
            <span>Nome do medicamento</span>
            <p>Unidades em estoque: </p>
            <p>Data da última aquisição: </p>
          </div>
        </div>

        <div className="card-medicamento">
          <img src="" alt="foto do medicamento" />
          <div className="infos-card-medicamento">
            <span>Nome do medicamento</span>
            <p>Unidades em estoque: </p>
            <p>Data da última aquisição: </p>
          </div>
        </div>
      </section>

      <Footer />
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .topo-estoque {
    text-align: center;
    margin: 20px 0;
  }

  .medicamentos-estoque {
    margin: 20px;
  }

  .card-medicamento {
    border: 1px solid #ddd;
    padding: 15px;
    margin-bottom: 15px;
    border-radius: 8px;
  }

  .infos-card-medicamento {
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

export default Estoque;
