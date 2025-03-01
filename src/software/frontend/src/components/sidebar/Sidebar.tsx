import styled from 'styled-components';

const Sidebar = () => {

  return (
    <div>
      <StyledWrapper>
        <div className='sidebar'>
          <div className='sidebar-buttons'>
            <a href='/dashboard'><button>Dashboard</button></a>
            <a href='/estoque'><button>Checagem de estoque</button></a>
            <a href='/prescricoes'><button>Prescrições</button></a>
            <a href='/montagens'><button>Montagens realizadas</button></a>
            <a href='/verificacao'><button>Verificação dos medicamentos</button></a>
          </div>
        </div>
      </StyledWrapper>
    </div>
  )
}

const StyledWrapper = styled.div`
.sidebar {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: static;

    background-color: #323848;
    height: 94vh;
    width: 15vw;
    overflow: hidden;
}

.sidebar-buttons {
    margin: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    width: 80%;
}

.sidebar-buttons a {
    text-decoration: none;
    color: aliceblue;
    width: 100%;
}

.sidebar-buttons button {
    width: 100%;
    background-color: #323848;
    transition: 0.3s;
    text-align: left;
}

.sidebar-buttons button:hover {
    background-color: #2ECC71;
    border: none;
} 
`;

export default Sidebar
