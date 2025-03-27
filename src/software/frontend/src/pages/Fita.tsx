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
  const [fita, setFita] = useState<{medicamento: string; quantidade: string}[]>([]);

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

  const handlePegarMedicamento = async (med: string, qty: string): Promise<void> => {
    try {
        const response = await fetch(`http://localhost:5000/dobot/medicamento/${med}`, {
            method: 'POST', // Certifique-se de que o método está correto (GET ou POST)
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ quantidade: qty }), // Envia a quantidade no corpo da requisição
        });

        if (!response.ok) {
            const errorMessage = await response.text(); // Captura a mensagem de erro do backend
            throw new Error(`Erro HTTP: ${response.status} - ${errorMessage}`);
        }

        const data: { message: string } = await response.json();
        alert(data.message); // Exibe a mensagem de sucesso do backend
    } catch (error) {
        alert('Erro ao pegar medicamento. Verifique o console para mais detalhes.');
        console.error('Erro:', error);
    }
};

const handleAdicionarMedicamento = async (): Promise<void> => {
  try {
    if (!medicamento || !quantidade) {
      alert("Selecione um medicamento e insira uma quantidade válida.");
      return;
    }

    const medicamentoExistente = fita.find((item) => item.medicamento === medicamento);

    if (medicamentoExistente) {
      // Atualiza a quantidade do medicamento existente
      setFita((prevFita) =>
        prevFita.map((item) =>
          item.medicamento === medicamento
            ? { ...item, quantidade: (parseInt(item.quantidade as string) + parseInt(quantidade)).toString() }
            : item
        )
      );
    } else {
      // Adiciona um novo medicamento à fita
      setFita((prevFita) => [...prevFita, { medicamento, quantidade }]);
    }

    const response = await fetch(`http://127.0.0.1:5000/dobot/fita/adicionar/${medicamento}/${quantidade}`, {
      method: 'POST',
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Erro HTTP: ${response.status} - ${errorMessage}`);
    }

    const data: { message: string } = await response.json();
    alert(data.message); // Exibe a mensagem de sucesso do backend
  } catch (error) {
    alert('Erro ao adicionar medicamento. Verifique o console para mais detalhes.');
    console.error('Erro:', error);
  }
};

const handleCancelarMontagem = async (): Promise<void> => {
  try {
      const response = await fetch('http://127.0.0.1:5000/dobot/fita/cancelar', {
          method: 'POST',
      });

      if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(`Erro HTTP: ${response.status} - ${errorMessage}`);
      }

      const data: { message: string } = await response.json();
      alert(data.message); // Exibe a mensagem de sucesso do backend

      // Limpa o estado da fita na interface
      setFita([]);
  } catch (error) {
      alert('Erro ao cancelar montagem. Verifique o console para mais detalhes.');
      console.error('Erro:', error);
  }
};

const handleFinalizarMontagem = async (): Promise<void> => {
  try {
      const response = await fetch('http://127.0.0.1:5000/dobot/fita/finalizar', {
          method: 'POST',
      });

      if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(`Erro HTTP: ${response.status} - ${errorMessage}`);
      }

      const data: { message: string } = await response.json();
      
      alert(data.message); // Exibe a mensagem de sucesso do backend
      setFita([]);
  } catch (error) {
      alert('Erro ao finalizar montagem. Verifique o console para mais detalhes.');
      console.error('Erro:', error);
  }
};

  return (
    <PageContainer>
      <nav><Header /></nav>
      <PageContent>
        {/* Cabeçalho */}
        <PageHeader>
          <h1>Fitas</h1>
          <button onClick={handleClearAlarms}>Limpar alarmes</button>
        </PageHeader>

        {/* Formulário para montar fita */}
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
          <ButtonContainer>
              <button onClick={handleAdicionarMedicamento}>Adicionar mais</button>
              <button onClick={handleCancelarMontagem}>Cancelar</button>
              <button onClick={handleFinalizarMontagem}>Enviar</button>
          </ButtonContainer>
        </MontarFitaContainer>

        {fita.length > 0 && (
          <FitaContainer>
            <h2>Medicamentos na Fita</h2>
            {fita.map((item, index) => (
              <div key={index}>
                Medicamento: {item.medicamento}, Quantidade: {item.quantidade}
              </div>
            ))}
          </FitaContainer>
        )}

        {/* Lista de medicamentos disponíveis */}
        <BuscarMedicamentoContainer>
          <h2>Buscar medicamento</h2>
          {medicamentos.map((med) => (
            <MedicamentoItem key={med}>
              <span>{med}</span>
              <button onClick={() => handlePegarMedicamento(med, '1')}>Pegar</button>
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
`;

const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const PageHeader = styled.div`
  width: 90%;
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h1 {
    color: #34495E;
    font-size: clamp(24px, 5vw, 36px);
    font-weight: 900;
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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;

  button {
    background-color: #2ECC71;
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;

    &:hover {
      background-color: #27AE60;
    }
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

const FitaContainer = styled.div`
  background-color: #ECF0F1;
  padding: 20px;
  border-radius: 12px;
  width: 90%;
  max-width: 1200px;
  color: #34495E;
  margin-top: 20px;

  h2 {
    font-size: 24px;
    margin-bottom: 15px;
  }

  div {
    padding: 10px;
    border-bottom: 1px solid #ddd;

    &:last-child {
      border-bottom: none;
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