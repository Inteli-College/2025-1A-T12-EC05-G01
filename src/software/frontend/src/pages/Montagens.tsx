import styled from 'styled-components';
import Footer from '../components/Footer';
import Navbar from '../components/sidebar/Navbar';
//import axios from 'axios';
//import classNames from 'classnames';


// VERIFICAR FUNCIONAMENTO NA PRÓXIMA SPRINT
// const StatusMontagem = ({ status }) => {
//   const statusClass = classNames("status", {
//     "status-separado": status === "Finalizado",
//     "status-em-separacao": status === "Em andamento",
//     "status-não-iniciado": status === "Esperando separação"
//   });

//   return <div className={statusClass}>{status}</div>;
// }

// const StatusMedicamento = ({ statusMedicamento }) => {

//   const statusMedicamentoClass = classNames("medicmaento", {
//     "medicamento-separado": statusMedicamento === "Separado",
//     "medicamento-em-separacao": statusMedicamento === "Em separação",
//     "medicamento-esperando-separacao": statusMedicamento === "Esperando separação"
//   });

//   return (
//     <div className={statusMedicamentoClass}>
//       <li>
//         <div className="medicamento">
//           <span>Sertralina 500mg</span>
//           <p>Quantidade: {quantidade}</p>
//         </div>
//         <span>{statusMedicamento}</span>
//       </li>
//     </div>
//   )
// }

const Montagens = () => {

  const quantidade = 1;

  return (
    <StyledWrapper>
      <div className='pagina-montagens'>
        <nav><Navbar /></nav>

        <div className="topo-montagens">
          <h1>Acompanhamento <br /> de montagens</h1>
          <button>Pausar operação ||</button>
        </div>

        <section className="montagens">
          <div className="card-montagem">
            <div className="topo-card-montagem">
              <div className="paciente-montagem">
                <span>João Silva</span>
                <p>Início: 24/02/2025, 16:10</p>
              </div>
              <div className="status">
                <span>Finalizado</span>
              </div>
            </div>


            <div className="medicamentos-montagem">
              <ul>
                <li>
                  <div className="medicamento">
                    <span>Sertralina 500mg</span>
                    <p>Quantidade: {quantidade}</p>
                  </div>
                  <span> Separado </span>
                </li>

                <li>
                  <div className="medicamento">
                    <span>Sertralina 500mg</span>
                    <p>Quantidade: {quantidade}</p>
                  </div>
                  <span> Separado </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="card-montagem">
            <div className="topo-card-montagem">
              <div className="paciente-montagem">
                <span>João Silva</span>
                <p>Início: 24/02/2025, 16:10</p>
              </div>
              <div className="status">
                <span>Finalizado</span>
              </div>
            </div>


            <div className="medicamentos-montagem">
              <ul>
                <li>
                  <div className="medicamento">
                    <span>Sertralina 500mg</span>
                    <p>Quantidade: {quantidade}</p>
                  </div>
                  <span> Separado </span>
                </li>

                <li>
                  <div className="medicamento">
                    <span>Sertralina 500mg</span>
                    <p>Quantidade: {quantidade}</p>
                  </div>
                  <span> Separado </span>
                </li>
              </ul>
            </div>
          </div>

        </section>

        <section className="acompanhamento-robo">
          <h2>Acompanhe o funcionamento do braço mecânico</h2>
          <div className="logs-robo">
            <p>Última atividade do dobot</p>
            <p>Penúltima atividade do robô</p>
            <p>Demais atividades do robô</p>
          </div>
        </section>

        <Footer />

      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
.pagina-montagens {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}

.topo-montagens {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 60%;
}

.status {
    border-radius: 20px;
    background-color: #4D925B;
    color: #fff;
    padding: .4rem 1.1rem;
    font-size: .9rem;
}

.montagens {
    width: 60%;
}

.topo-card-montagem {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 1.5rem;
    width: 100%;
}

.topo-card-montagem p {
    margin: 0;
}

.paciente-montagem {
    display: flex;
    flex-direction: column;
    color: #FFF;
    padding: 0 0 0 1rem;
}

.paciente-montagem span {
    font-weight: 400;
    font-size: 2rem;
}

.paciente-montagem p {
    font-weight: 200;
    font-size: .8rem;
    margin: 0;
}

.card-montagem {
    border: 1px solid #ddd;
    padding: 15px;
    margin-bottom: 15px;
    border-radius: 15px;
    width: 100%;

    background-color: #2C3E50;
    color: aliceblue;
}

.medicamentos-montagem ul {
    list-style-type: none;
    padding: 0 0 0 1rem;
}

.medicamentos-montagem li {
    margin-bottom: 10px;
    background-color: #71E9667D;
    padding: .5rem 2rem;
    border-radius: 12px;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.medicamento span {
    font-size: 1.5rem;
    padding: 1rem 0;
}

.medicamento p {
    margin: 0;
}

.medicamentos-montagem li span {
    font-size: 1.5rem;

}

.logs-robo {
    margin-top: 10px;
}

button {
    background-color: #E67E22;
    color: white;
    border: none;
    padding: 1.5rem;
    border-radius: 5px;
    cursor: pointer;
    height: 100%;
}

button:hover {
    background-color: #FF7800;
}
`;

export default Montagens;
