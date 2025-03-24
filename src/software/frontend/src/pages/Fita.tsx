import styled from 'styled-components';
import Header from '../components/sidebar/Navbar';
import Footer from '../components/Footer';

const Fita: React.FC = () => {
  const handleClearAlarms = async (): Promise<void> => {
    try {
      const response = await fetch('http://127.0.0.1:5000/limpar-todos-alarmes');
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

  return (
    <PageContainer>
      <nav><Header /></nav>
      <PageContent>
        <PageHeader>
          <h1>Fitas</h1>
        </PageHeader>
        <div className="buttonAlarme">
          <button onClick={handleClearAlarms}>Limpar alarmes</button>
        </div>
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
    background-color: #2ECC71; 
    color: white; 
    border: none; 
    padding: 20px; 
    border-radius: 20px; 
    font-weight: bold; 
    cursor: pointer;
    font-size: 20px;
    
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

const FooterWrapper = styled.div`
  width: 100%;
  margin-top: auto;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
`;

export default Fita;
