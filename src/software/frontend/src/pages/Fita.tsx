import styled from "styled-components";
import Header from "../components/sidebar/Navbar";
import Footer from "../components/Footer";
import {
  limparAlarmes,
  adicionarMedicamentoFita,
  finalizarMontagem,
  executarRotinaMedicamento
} from "../services/apiService";
import { useState } from "react";

function Fita() {
  const [medicamento, setMedicamento] = useState("");
  const [quantidade, setQuantidade] = useState("");

  const handleLimparAlarmes = async () => {
    await limparAlarmes();
    alert("Alarmes removidos!");
  };

  const handleAdicionarMedicamento = async () => {
    if (!medicamento || !quantidade) {
      alert("Selecione um medicamento e uma quantidade!");
      return;
    }
    await adicionarMedicamentoFita(medicamento, quantidade);
    alert("Medicamento adicionado!");
  };

  const handleFinalizarMontagem = async () => {
    await finalizarMontagem();
    alert("Montagem concluída!");
  };

  const handlePegarMedicamento = async (medicamento) => {
    await executarRotinaMedicamento(medicamento);
    alert(`Medicamento ${medicamento} pego!`);
  };

  return (
    <PageContainer>
      <nav>
        <Header />
      </nav>
      <PageContent>
        <PageHeader>
          <h1>Fitas</h1>
        </PageHeader>
        <div className="buttonAlarme">
          <button onClick={handleLimparAlarmes}>Limpar alarmes</button>
        </div>

        {/* Formulário para adicionar medicamento */}
        <Card>
          <label>Medicamento:</label>
          <select onChange={(e) => setMedicamento(e.target.value)}>
            <option value="">Selecione</option>
            <option value="Paracetamol 750mg">Paracetamol 750mg</option>
            <option value="Loratadina 10mg">Loratadina 10mg</option>
          </select>

          <label>Quantidade:</label>
          <input
            type="number"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
          />

          <button onClick={handleAdicionarMedicamento}>Adicionar</button>
          <button onClick={handleFinalizarMontagem}>Finalizar</button>
        </Card>

        {/* Lista de medicamentos disponíveis */}
        <MedicamentosList>
          <h2>Buscar medicamento</h2>
          <ul>
            <li>
              Loratadina 10mg <button onClick={() => handlePegarMedicamento("Loratadina 10mg")}>Pegar</button>
            </li>
            <li>
              Paracetamol 750mg <button onClick={() => handlePegarMedicamento("Paracetamol 750mg")}>Pegar</button>
            </li>
          </ul>
        </MedicamentosList>
      </PageContent>

      <FooterWrapper>
        <Footer />
      </FooterWrapper>
    </PageContainer>
  );
}

// Estilos da Página
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  position: relative;
`;

const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 0 15px;
  gap: 1.5rem;
  margin-top: 70px;
  padding-bottom: 80px;

  .buttonAlarme {
    width: 90%;
    max-width: 1200px;
    display: flex;
    flex-direction: row;
    justify-content: right;
    margin-bottom: 1rem;
  }

  .buttonAlarme > button {
    background-color: #2ecc71;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 20px;
    font-weight: bold;
    cursor: pointer;
    font-size: 20px;
  }
`;

const PageHeader = styled.div`
  width: 90%;
  max-width: 1200px;
  padding: 0 15px;
  margin: 2rem 0 1rem;

  h1 {
    color: #34495e;
    font-size: clamp(24px, 5vw, 36px);
    font-weight: 900;
  }
`;

const Card = styled.div`
  background: #2c3e50;
  padding: 20px;
  border-radius: 10px;
  color: white;
  width: 90%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;

  label {
    font-size: 18px;
  }

  select,
  input {
    width: 80%;
    padding: 8px;
    border-radius: 5px;
  }

  button {
    background: #2ecc71;
    color: white;
    border: none;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
  }
`;

const MedicamentosList = styled.div`
  width: 90%;
  max-width: 600px;

  h2 {
    color: #34495e;
    font-size: 22px;
    margin-bottom: 10px;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    background: #2c3e50;
    color: white;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  button {
    background: #2ecc71;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
  }
`;

const FooterWrapper = styled.div`
  width: 100%;
  margin-top: auto;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
`;

export default Fita;
