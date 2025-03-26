import styled from 'styled-components';
import Navbar from '../components/sidebar/Navbar';
import Footer from '../components/Footer';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const Verificacao = () => {
  const quantidade = 1;

  return (
    <PageContainer>
      <nav><Navbar /></nav>
      <PageContent>
        <PageHeader>
          <h1>Selagem</h1>
        </PageHeader>

        <CardContainer>
          <Card>
            <div className="infos-card-fita">
              <div className="paciente-fita">
                <span>Maria Oliveira</span>
                <p>24/02/2025, 16:00</p>
              </div>
              <Button variant="success">Iniciar selagem</Button>
            </div>
            <div className="interacao-card-fita">
              <ul>
                <li>
                  <span>Paracetamol 750mg</span>
                  <p>Quantidade: {quantidade}</p>
                </li>
                <li>
                  <span>Dipirona 1g</span>
                  <p>Quantidade: {quantidade}</p>
                </li>
              </ul>
            </div>
          </Card>

          <Card>
            <div className="infos-card-fita">
              <div className="paciente-fita">
                <span>José Santos</span>
                <p>24/02/2025, 16:05</p>
              </div>
              <Button variant="success">Iniciar selagem</Button>
            </div>
            <div className="interacao-card-fita">
              <ul>
                <li>
                  <span>Loratadina 10mg</span>
                  <p>Quantidade: {quantidade}</p>
                </li>
                <li>
                  <span>Dipirona 1g</span>
                  <p>Quantidade: {quantidade}</p>
                </li>
                <li>
                  <span>Miosan 10mg</span>
                  <p>Quantidade: {quantidade}</p>
                </li>
              </ul>
            </div>
          </Card>

          <Card>
            <div className="infos-card-fita">
              <div className="paciente-fita">
                <span>Ana Silva</span>
                <p>24/02/2025, 16:10</p>
              </div>
              <Button variant="success">Iniciar selagem</Button>
            </div>
            <div className="interacao-card-fita">
              <ul>
                <li>
                  <span>Sertralina 500mg</span>
                  <p>Quantidade: {quantidade}</p>
                </li>
                <li>
                  <span>Paracetamol 750mg</span>
                  <p>Quantidade: {quantidade}</p>
                </li>
              </ul>
            </div>
          </Card>
        </CardContainer>
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
  min-height: 100vh; /* Ensure full viewport height */
  position: relative; /* For footer positioning */
`;

const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 0 15px;
  margin-top: 70px; /* Added to account for fixed navbar */
  padding-bottom: 80px; /* Add space for footer */
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

const CardContainer = styled.div`
  width: 90%;
  max-width: 1200px;
  margin: 1rem 0;
  
  .infos-card-fita {
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    
    @media (min-width: 576px) {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
  }

  .paciente-fita {
    display: flex;
    flex-direction: column;
    color: #FFF;
  }

  .paciente-fita span {
    font-weight: 400;
    font-size: clamp(1.5rem, 4vw, 2rem);
  }

  .paciente-fita p {
    font-weight: 200;
    font-size: 1rem;
    margin: 0;
  }

  .interacao-card-fita ul {
    list-style-type: none;
    padding: 0;
    color: #323848;
  }

  .interacao-card-fita li {
    margin-bottom: 10px;
    background-color: #E9B78A;
    padding: .2rem 1rem;
    border-radius: 12px;
  }

  .interacao-card-fita li span {
    font-size: clamp(1.2rem, 3vw, 1.5rem);
  }

  .interacao-card-fita li p {
    font-size: 1rem;
    margin: 0;
  }
`;

const FooterWrapper = styled.div`
  width: 100%;
  margin-top: auto; /* Push to bottom if content is short */
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
`;

export default Verificacao;
