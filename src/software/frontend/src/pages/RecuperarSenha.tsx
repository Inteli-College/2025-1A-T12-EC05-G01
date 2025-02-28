import React from 'react';
import styled from 'styled-components';

const RecuperarSenha = () => {
  return (
    <StyledWrapper>
      <div className="form-box">
        <form className="form" action="/recuperar_senha" method="POST">
          <span className="title">Recuperar Senha</span>
          <span className="subtitle">Digite seu email abaixo para recuperar a sua senha.</span>
          <div className="form-container">
            <input type="email" className="input" name="email" placeholder="Digite seu email" required />
          </div>
          <button type="submit">Recuperar Senha</button>
        </form>
        <div className="form-section">
          <p><a href="/login" className="link">Voltar ao login</a></p>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .form-box {
    max-width: 300px;
    background: #34495E;
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

  /*Form text*/
  .title {
    font-weight: bold;
    font-size: 1.6rem;
    color: #ffffff;
  }

  .subtitle {
    font-size: 1rem;
    color: #dddbdb;
  }

  /*Inputs box*/
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
    font-size: .85rem;
    background-color: #8098b0;
    box-shadow: rgb(0 0 0 / 8%) 0 -1px;
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

  /*Button*/
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
  }

  .form button:hover {
    background-color: #26dd72;
  }
`;

export default RecuperarSenha;
