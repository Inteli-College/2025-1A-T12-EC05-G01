import styled from 'styled-components';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config/api';

const RecuperarSenha = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/recuperar-senha`, { email });
      setMessage(response.data.message);
      setError('');
      navigate('/login');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.error);
      } else {
        setError('An unexpected error occurred');
      }
      setMessage('');
    }
  };

  return (
    <StyledWrapper>
      <div className="form-box">
        <form className="form" onSubmit={handleSubmit}>
          <span className="title">Recuperar Senha</span>
          <span className="subtitle">Digite seu email abaixo para recuperar a sua senha.</span>
          <div className="form-container">
            <input
              type="email"
              className="input"
              name="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          {message && <p className="message">{message}</p>}
          <button type="submit">Recuperar Senha</button>
        </form>
        <div className="form-section">
          <p><a href="/login" className="link">Voltar ao login</a></p>
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
  padding: 0 15px;

  .form-box {
    width: 100%;
    max-width: 300px;
    background: #34495E;
    overflow: hidden;
    border-radius: 16px;
    color: #010101;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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
    font-size: clamp(1.3rem, 4vw, 1.6rem);
    color: #ffffff;
  }

  .subtitle {
    font-size: clamp(0.9rem, 3vw, 1rem);
    color: #dddbdb;
  }

  .form-container {
    overflow: hidden;
    border-radius: 8px;
    background-color: #fffbfb;
    margin: 1rem 0 .5rem;
    width: 100%;
  }

  .input {
    background: none;
    border: 0;
    outline: 0;
    height: 40px;
    width: 100%;
    border-bottom: 1px solid #eee;
    font-size: .9rem;
    padding: 8px 15px;
  }

  .form-section {
    padding: 16px;
    font-size: clamp(0.8rem, 2.5vw, 0.85rem);
    background-color: #8098b0;
    box-shadow: rgb(0 0 0 / 8%) 0 -1px;
  }

  .form-section p {
    color: rgb(244, 243, 243);
    margin: 8px 0;
  }

  .form-section a {
    font-weight: bold;
    color: #34495E;
    transition: color .3s ease;
    text-decoration: underline;
  }

  .form-section a:hover {
    color: #232a32;
    text-decoration: underline;
  }

  .form button {
    background-color: #2ECC71;
    color: #fff;
    border: 0;
    border-radius: 24px;
    padding: 10px 16px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color .3s ease;
    width: 100%;
  }

  .form button:hover {
    background-color: #26dd72;
  }

  .error {
    color: red;
    font-size: 0.9rem;
  }

  .message {
    color: green;
    font-size: 0.9rem;
  }
`;

export default RecuperarSenha;
