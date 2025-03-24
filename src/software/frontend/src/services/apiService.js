import axios from "axios";

const API_BASE_URL = "http://SEU_SERVIDOR/api"; // Substituir pelo IP do servidor

export const limparAlarmes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/limpar-todos-alarmes`);
    return response.data;
  } catch (error) {
    console.error("Erro ao limpar alarmes:", error);
  }
};

export const adicionarMedicamentoFita = async (medicamento, quantidade) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/adicionar-medicamento`, {
      medicamento,
      quantidade
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao adicionar medicamento:", error);
  }
};

export const finalizarMontagem = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/finalizar-montagem`);
    return response.data;
  } catch (error) {
    console.error("Erro ao finalizar montagem:", error);
  }
};

export const executarRotinaMedicamento = async (medicamento) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/executar-medicamento`, {
      medicamento
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao executar rotina do medicamento:", error);
  }
};
