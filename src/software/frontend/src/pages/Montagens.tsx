import styled from 'styled-components';
import Header from '../components/sidebar/Navbar';
import Footer from '../components/Footer';

function Montagens() {
  return (
    <PageContainer>
      <nav><Header /></nav>
      <PageContent>
        <PageHeader>
          <h1>Montagens</h1>
        </PageHeader>
        
        <div className='button'>
          <button> ⏸️ Pausar Montagem</button>
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
      </PageContent>
      
      <FooterWrapper>
        <Footer />
      </FooterWrapper>
    </PageContainer>
  )
};

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh; /* Ensure full viewport height */
  position: relative; /* For footer positioning */
`;

const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 0 15px;
  gap: 1.5rem;
  margin-top: 70px; /* Added to account for fixed navbar */
  padding-bottom: 80px; /* Add space for footer */
  
  .button {
    width: 90%;
    max-width: 1200px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-bottom: 1rem;
    
    @media (min-width: 768px) {
      justify-content: flex-end;
    }
  }
  
  .button > button {
    background-color: #E87722; 
    color: white; 
    border: none; 
    padding: 15px 20px; 
    border-radius: 5px; 
    font-weight: bold; 
    cursor: pointer;
    font-size: clamp(14px, 3vw, 16px);
    
    @media (min-width: 576px) {
      padding: 20px 25px;
    }
  }
`;

const PageHeader = styled.div`
  width: 90%;
  max-width: 1200px;
  padding: 0 15px;
  margin: 2rem 0 1rem;
  
  h1 {
    color: #34495E;
    font-size: clamp(24px, 5vw, 36px);
    font-weight: 900;
  }
`;

const FitaBox = styled.div`
    width: 90%;
    max-width: 1200px;
    Background-Color: #2C3E50;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 1rem;
    border-radius: 15px;
    margin-bottom: 10px;

    .topo-fita {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 15px;
      color: white;
      
      @media (min-width: 576px) {
        width: 90%;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
    }

    .topo-fita h3 {
      font-size: clamp(18px, 4vw, 24px);
      font-weight: 550;
      margin: 0;
    }

    .topo-fita p {
      margin: 0;
      font-size: clamp(14px, 3vw, 16px);
    }

    .andamento {
      background-color: gray;
      padding: 10px;
      border-radius: 20px;
      width: 100%;
      text-align: center;
      
      @media (min-width: 576px) {
        width: auto;
        padding: 15px;
      }
    }
`;

interface StatusBoxProps {
  status: "separado" | "em separação" | "esperando separação" | string;
}

const StatusBox = styled.div<StatusBoxProps>`
  background-color: ${(props) =>
    props.status == "separado" ? "#71E9667D" :
      props.status == "em separação" ? "#ECBB59" :
        props.status == "esperando separação" ? "#E9B78A" : "gray"};
  padding: 15px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  text-transform: capitalize;
  color: white;
  margin: 5px 0;
  
  @media (min-width: 576px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 20px 30px;
  }

  .informacoes span {
    font-size: clamp(18px, 4vw, 24px);
    font-weight: 550;
    margin: 0;
    word-break: break-word;
  }

  .informacoes p {
    font-size: clamp(14px, 3vw, 16px);
    font-weight: 500;
    margin: 0;
  }

  .status {
    font-size: clamp(16px, 3.5vw, 20px);
    font-weight: 550;
    margin-top: 10px;
    
    @media (min-width: 576px) {
      margin-top: 0;
    }
  }
`;

interface StatusComponentProps {
  medicamento: string;
  dosagem: string;
  quantidade: number;
  status: string;
}

const StatusComponent = ({ medicamento, dosagem, quantidade, status }: StatusComponentProps) => {
  return (
    <StatusBox status={status}>
      <div className="informacoes">
        <span>{medicamento} {dosagem}</span>
        <p>Quantidade: {quantidade} </p>
      </div>
      <div className="status">{status}</div>
    </StatusBox>
  );
};

interface FitaComponentProps {
  paciente: string;
  data: string;
  horario: string;
}

const FitaComponent = ({ paciente, data, horario }: FitaComponentProps) => {
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

const FooterWrapper = styled.div`
  width: 100%;
  margin-top: auto; /* Push to bottom if content is short */
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
`;

export default Montagens;
