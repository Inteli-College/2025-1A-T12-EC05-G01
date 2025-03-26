import styled from 'styled-components';
import Header from '../components/sidebar/Navbar';
import Footer from '../components/Footer';
import { useState } from 'react';

const medicamentos = [
  '1',
  '2',
  '3',
  '4',
];

const Fita: React.FC = () => {
  const [medicamento, setMedicamento] = useState('');
  const [quantidade, setQuantidade] = useState('');

  const handleClearAlarms = async (): Promise<void> => {
    try {
      const response = await fetch('http://127.0.0.1:5000/dobot/limpar-todos-alarmes');
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      const data: { message: string } = await response.json();
      alert(data.message);
    } catch (error) {
      alert('Erro ao limpar alarmes');
      console.error('Erro:', error);
    }
  };

  const handlePickMedication = async (med: string,): Promise<void> => {
    try {
      const response = await fetch(`http://localhost:5000/dobot/medicamento/${med}`);
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      const data: { message: string } = await response.json();
      alert(data.message);
    } catch (error) {
      alert('Erro ao pegar medicamento');
      console.error('Erro:', error);
    }
  };

  const handleAdicionarMais = async () => {
    if (!medicamento || !quantidade) {
      alert("Selecione o medicamento e a quantidade!");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:5000/dobot/fita/adicionar/${medicamento}/${quantidade}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        alert("Medicamento adicionado com sucesso!");
      } else {
        alert("Erro ao adicionar medicamento.");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao se conectar com o servidor.");
    }
  };
  
  const handleCancelar = async () => {
    try {
      const response = await fetch(`http://localhost:5000/dobot/fita/cancelar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        alert("Operação cancelada com sucesso!");
      } else {
        alert("Erro ao cancelar operação.");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao se conectar com o servidor.");
    }
  };
  
  const handleEnviar = async () => {
    try {
      const response = await fetch(`http://localhost:5000/dobot/fita/finalizar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        alert("Operação finalizada com sucesso!");
      } else {
        alert("Erro ao finalizar operação.");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao se conectar com o servidor.");
    }
  };
  

  return (
    <PageContainer>
      <nav><Header /></nav>
      <PageContent>
        <PageHeader>
          <h1>Fitas</h1>
          <button onClick={handleClearAlarms}>Limpar alarmes</button>
        </PageHeader>

        <MontarFitaContainer>
          <h2>Enviar fita</h2>
          <DropdownContainer>
            <select value={medicamento} onChange={(e) => setMedicamento(e.target.value)}>
              <option value="" disabled>Selecione o medicamento</option>
              {medicamentos.map((med) => (
                <option key={med} value={med}>{med}</option>
              ))}
            </select>
            <input
              type="number"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              placeholder="Quantidade"
            />
          </DropdownContainer>
          <div className="botoes-container">
            <button onClick={handleAdicionarMais}>Adicionar mais</button>
            <button onClick={handleCancelar}>Cancelar</button>
            <button onClick={handleEnviar}>Enviar</button>
          </div>
        </MontarFitaContainer>

        <BuscarMedicamentoContainer>
          <h2>Buscar medicamento</h2>
          {medicamentos.map((med) => (
            <MedicamentoItem key={med}>
              <span>{med}</span>
              <button onClick={() => handlePickMedication(med, '1')}>Pegar</button>
            </MedicamentoItem>
          ))}
        </BuscarMedicamentoContainer>
      </PageContent>
      <FooterWrapper>
        <Footer />
      </FooterWrapper>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  position: relative;
  z-index> 0;
`;

const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const PageHeader = styled.div`
  position: relative;
  width: 100%;
  background-color: #fff;
  padding: 16px;
  margin-top: 70px; 
  z-index: 10; 
  display: flex;
  justify-content: space-between;

  h1 {
    color: #34495E;
    font-size: clamp(24px, 5vw, 36px);
    font-weight: 900;
    align-items: left;
  }

  button {
    background-color: #2ECC71;
    color: white;
    border: none;
    padding: 15px 25px;
    border-radius: 20px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s;
    align-items: right;

    &:hover {
      background-color: #27AE60;
    }
  }
`;

const MontarFitaContainer = styled.div`
  background-color: #2C3E50;
  padding: 20px;
  border-radius: 12px;
  width: 90%;
  max-width: 1200px;
  color: white;
  margin-top: 20px;

  h2 {
    font-size: 24px;
    margin-bottom: 15px;
  }

  .botoes-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.botoes-container button {
  background-color: #2ECC71;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #27AE60;
  }
}
  

`;


const DropdownContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;

  select, input {
    width: 50%;
    padding: 10px;
    border-radius: 8px;
    border: none;
    font-size: 16px;
  }
`;


const BuscarMedicamentoContainer = styled.div`
  width: 90%;
  max-width: 1200px;
  margin-top: 20px;

  h2 {
    color: #34495E;
    font-size: 24px;
    margin-bottom: 15px;
  }
`;

const MedicamentoItem = styled.div`
  background-color: #2C3E50;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  margin-bottom: 8px;
  border-radius: 8px;

  button {
    background-color: #2ECC71;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background-color: #27AE60;
    }
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