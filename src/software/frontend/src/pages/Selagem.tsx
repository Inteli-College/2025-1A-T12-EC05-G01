import { useState, useEffect } from "react";
import styled from 'styled-components';
import Navbar from '../components/sidebar/Navbar';
import Footer from '../components/Footer';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

interface Fita {
  id: string;
  nome: string;
  dateTime: string;
  medicamentos: { medicamento: string; quantidade: number }[];
}

const Verificacao = () => {

  const [Fitas, setFitas] = useState<Fita[]>([]);
  const [loading, setLoading] = useState(true);
  // Removed unused error state

  useEffect(() => {
    async function fetchFitas() {
      try {
        setLoading(true);
        const data = await LerFitas();
        setFitas(data || []);
      } catch (err) {
        if (err instanceof Error) {
          console.error(err.message);
        } else {
          console.error("Erro:", err);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchFitas();
  }, []);

  return (
    <PageContainer>
      <nav><Navbar /></nav>
      <PageContent>
        <PageHeader>
          <h1>Selagem</h1>
        </PageHeader>

        {/* Removed unused error message */}

        <CardContainer>
          {Fitas.length > 0 ? (
            Fitas.map((fita, index) => 
              <CardSelagem
                key={index}
                id={fita.id}
                nome={fita.nome}
                dateTime={fita.dateTime}
                medicamentos={fita.medicamentos}
              />
            )
          ) : (
            !loading && <NoPrescritionMessage>Nenhuma fita encontrada</NoPrescritionMessage>
          )}
        </CardContainer>
      </PageContent>
      
      <FooterWrapper>
        <Footer />
      </FooterWrapper>
    </PageContainer>

  );
};

interface CardSelagemProps {
  id: string;
  nome: string;
  dateTime: string;
  medicamentos: { medicamento: string; quantidade: number }[];
}

function CardSelagem({ id, nome, dateTime, medicamentos }: CardSelagemProps) {
  return (
    <Card>
      <div className="infos-card-fita">
        <div className="paciente-fita">
          <span>{nome}</span>
          <p>{dateTime}</p>
        </div>
        <BotoesSeparacao>
          <Button variant="success" onClick={() => ButtonSelagemRealizada({id})}>Selagem Realizada</Button>
          <Button variant="warning" onClick={() => ButtonErroSeparacao({id})}>Erro na separação</Button>
        </BotoesSeparacao>
      </div>
      <div className="interacao-card-fita">
        <ul>
          {medicamentos .map((medicamento, index) => 
            <CardMedicamento 
              key={index}
              medicamento={medicamento.medicamento} 
              quantidade={medicamento.quantidade}
            />
          )}
        </ul>
      </div>
    </Card>
  );
}

function CardMedicamento ({medicamento, quantidade}: { medicamento: string; quantidade: number }){
  return(
      <li>
        <span>{medicamento}</span>
        <p>Quantidade: {quantidade}</p>
      </li>
  );
}

async function ButtonSelagemRealizada ({id}: { id: string }){
  const payload = {
    id: id,
    status_prescricao: "selada"
  }
  try {
    const res = await fetch("http://127.0.0.1:3000/prescricao_aceita/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.ok) {
        alert("Selagem salva no banco de dados");
        window.location.reload();
    } else {
        alert("Erro ao salvar: " + data.error);
    }
  } catch (error) {
      console.error("Erro ao salvar a selagem:", error);
      alert("Erro ao salvar a selagem.");
  }
}

async function ButtonErroSeparacao ({id}: { id: string }){
  const payload = {
    id: id,
    status_prescricao: "erro_separacao"
  }
  try {
    const res = await fetch("http://127.0.0.1:3000/prescricao_aceita/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.ok) {
        alert("Salvo no banco de dados");
        window.location.reload(); 
    } else {
        alert("Erro ao salvar: " + data.error);
    }
  } catch (error) {
      console.error("Erro ao salvar o erro:", error);
      alert("Erro ao salvar.");
  }
}

async function LerFitas(){
  try {
    const res = await fetch("http://127.0.0.1:3000/fitas/aguardando-selagem", {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });
    const data = await res.json();
    if (res.ok) {
      return data.fitas || [];
    } else {
      console.error("Erro ao ler: " + (data.error || res.statusText));
      return [];  // Retorna array vazio em caso de erro
    }
  } catch (error) {
    console.error("Erro ao ler:", error);
    return [];  // Retorna array vazio em caso de erro
  }
}


const NoPrescritionMessage = styled.div`
  text-align: center;
  padding: 30px 15px;
  color: #7f8c8d;
  background-color: #f8f9fa;
  border-radius: 10px;
  font-weight: 500;
`;

const BotoesSeparacao = styled.div`
  display:flex;
  gap: 10px;

`;

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
