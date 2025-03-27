import styled from 'styled-components';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config/api';

const Cadastro = () => {
  const [email, setEmail] = useState('');
  const [nome, setNome] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isDoctor, setIsDoctor] = useState(false);
  const [crm, setCrm] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    try {
      // Cria o usuário via Firebase
      await axios.post(`${API_BASE_URL}/cadastro`, { email, password, confirm_password: confirmPassword });
      
      // Se for médico, cria registro na tabela de medicos com CRM, senão, cria registro em farmaceutico
      if (isDoctor) {
        await axios.post(`${API_BASE_URL}/medico/create`, { email, nome, crm });
      } else {
        await axios.post(`${API_BASE_URL}/farmaceutico/create`, { email, nome });
      }

      navigate('/login');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.error);
      } else {
        setError('Ocorreu um erro inesperado');
      }
    }
  };

  return (
    <StyledWrapper>
      <div className="form-box">
        <form className="form" onSubmit={handleSubmit}>
          <span className="title">Cadastre-se</span>
          <span className="subtitle">Crie uma conta com seu email.</span>
          <div className="form-container">
            <input
              type="email"
              className="input"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="text"
              className="input"
              name="nome"
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
            <input
              type="password"
              className="input"
              name="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              className="input"
              name="confirm_password"
              placeholder="Confirmar Senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <div className="checkbox-container">
              <input
                type="checkbox"
                id="isDoctor"
                checked={isDoctor}
                onChange={(e) => setIsDoctor(e.target.checked)}
              />
              <label htmlFor="isDoctor">Sou Médico</label>
            </div>
            {isDoctor && (
              <input
                type="text"
                className="input"
                name="crm"
                placeholder="CRM"
                value={crm}
                onChange={(e) => setCrm(e.target.value)}
                required
              />
            )}
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit">Cadastrar</button>
        </form>
        <div className="form-section">
          <p>Já tem uma conta? <a href="/login" className="link">Faça login</a></p>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: rgb(255, 255, 255);

  .form-box {
    max-width: 300px;
    background: #34495e;
    overflow: hidden;
    border-radius: 16px;
    color: #010101;
  }

  .form {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 32px 24px 24px;
    gap: 16px;
    text-align: center;
  }

  .title {
    font-weight: bold;
    font-size: 1.6rem;
    color: #ffffff;
  }

  .subtitle {
    font-size: 1rem;
    color: #dddbdb;
  }

  .form-container {
    overflow: hidden;
    border-radius: 8px;
    background-color: #fffbfb;
    margin: 1rem 0 0.5rem;
    width: 100%;
  }

  .input {
    background: none;
    border: 0;
    outline: 0;
    height: 40px;
    width: 100%;
    border-bottom: 1px solid #eee;
    font-size: 0.9rem;
    padding: 8px 15px;
  }

  .checkbox-container {
    display: flex;
    align-items: center;
    padding: 8px 15px;
  }

  .checkbox-container label {
    margin-left: 8px;
    font-size: 0.9rem;
    color: #333;
  }

  .form-section {
    padding: 16px;
    font-size: 0.85rem;
    background-color: #8098b0;
    box-shadow: rgb(0 0 0 / 8%) 0 -1px;
  }

  .form-section a {
    font-weight: bold;
    color: #34495e;
    transition: color 0.3s ease;
    text-decoration: underline;
  }

  .form-section a:hover {
    color: #232a32;
    text-decoration: underline;
  }

  .form button {
    background-color: #2ecc71;
    color: #fff;
    border: 0;
    border-radius: 24px;
    padding: 10px 16px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .form button:hover {
    background-color: #26dd72;
  }

  .error {
    color: red;
    font-size: 0.9rem;
  }
`;

export default Cadastro;
