import styled from 'styled-components';
import Header from '../components/sidebar/Navbar';
import Footer from '../components/Footer';

const BodyMontagens = styled.div`

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;

    > nav {
      width: 100%; 
    }
    
    > footer {
      width: 100%; 
    }
    
    .button {
      width: 70%;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;  
    }
    
    .button > button {
      background-color: #E87722; 
      color: white; 
      border: none; 
      padding: 20px 25px; 
      border-radius: 5px; 
      font-weight: bold; 
      cursor: pointer;
      font-size: 16px;
    }
`;

const StatusBox = styled.div`
  background-color: ${(props) =>
    props.status == "separado" ? "#71E9667D" :
      props.status == "em separação" ? "#ECBB59" :
        props.status == "esperando separação" ? "#E9B78A" : "gray"};
  padding: 20px 30px;
  border-radius: 15px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 80%;
  text-transform: capitalize;


  color: white;

  .informacoes span {
    font-size: 24px;
    font-weight: 550;
    margin: 0;
  }

  .informacoes p {
    font-size: 16px;
    font-weight: 500;
    margin: 0;
  }

  .status {
    font-size: 20px;
    font-weight: 550;
  }

`;

const StatusComponent = ({ medicamento, dosagem, quantidade, status }) => {
  return (
    <StatusBox status={status}>
      <div className="informacoes">
        <span>{medicamento} {dosagem}</span>
        <p>Quantidade: {quantidade} </p>
      </div>
      <div className="status">{status}</div>
    </StatusBox>)
};

const FitaBox = styled.div`
    width: 70%;
    Background-Color: #2C3E50;
    
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;

    padding: 1rem;
    border-radius: 30px;

    .topo-fita {
      width: 90%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      color: white;
    }

    .topo-fita h3 {
      font-size: 24px;
      font-weight: 550;
      margin: 0;
    }

    .topo-fita p {
      margin: 0;
      font-size: 16px;
    }

    .andamento {
      background-color: gray;
      padding: 15px;
      border-radius: 20px;
    }
`;

const FitaComponent = ({ paciente, data, horario }) => {
  return (
    <div className='topo-fita'>
      <div className="dados">
        <h3>{paciente}</h3>
        <p>Início: {data}, {horario} </p>
      </div>

      <div className="andamento">
        andamento
      </div>
    </div>
  )
};

function Montagens() {
  return (
    <BodyMontagens>
      <nav><Header /></nav>
      <div className='button'>
        <button> ⏸️ Pausar <br /> Montagem</button>
      </div>
      <FitaBox>
        <FitaComponent paciente="João Silva" data="12/10/2025" horario="16:10" />
        <StatusComponent medicamento="Dipirona" dosagem="500mg" quantidade={2} status="separado" />
        <StatusComponent medicamento="Paracetamol" dosagem="750mg" quantidade={1} status="separado" />
      </FitaBox>

      <FitaBox>
        <FitaComponent paciente="Julia Santos" data="12/10/2025" horario="16:16" />
        <StatusComponent medicamento="Loratadina" dosagem="10mg" quantidade={2} status="separado" />
        <StatusComponent medicamento="Dipirona" dosagem="1g" quantidade={1} status="em separação" />
        <StatusComponent medicamento="Cloridrato de Ciclobenzaprina" dosagem="10mg" quantidade={1} status="esperando separação" />
      </FitaBox>

      <FitaBox>
        <FitaComponent paciente="Kira Romantini" data="12/10/2025" horario="16:22" />
        <StatusComponent medicamento="Loratadina" dosagem="10mg" quantidade={2} status="esperando separação" />
        <StatusComponent medicamento="Dipirona" dosagem="1g" quantidade={1} status="esperando separação" />
        <StatusComponent medicamento="Cloridrato de Ciclobenzaprina" dosagem="10mg" quantidade={1} status="esperando separação" />
      </FitaBox>

      <footer>
        <Footer />
      </footer>
    </BodyMontagens>
  )
};


export default Montagens;
