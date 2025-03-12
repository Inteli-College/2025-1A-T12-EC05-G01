import styled from 'styled-components';
import SidebarItem from './SidebarItem';
import { FaBars } from 'react-icons/fa'

const Sidebar = ({ active }) => {

  const closeSidebar = () => {
    active(false)
  }

  return (
    <div>
      <Container sidebar={active}>
        <FaBars onClick={closeSidebar} />
        <Content>
          <SidebarItem Text='Checagem de estoque' Path='/estoque' />
          <SidebarItem Text='Prescrições' Path='/prescricoes' />
          <SidebarItem Text='Montagens realizadas' Path='/montagens' />
          <SidebarItem Text='Montagens realizadas' Path='/montagens' />
          <SidebarItem Text='Verificação dos medicamentos' Path='/verificacao' />
        </Content>
      </Container>
    </div>
  )
}

const Container = styled.div`
  background-color:#323848;
  position: fixed;
  height: 100%;
  top: 0px;
  left: 0px;
  width: 300px;
  left: ${props => props.sidebar ? '0' : '-100%'};
  animation: showSidebar .4s;

  > svg {
        position: fixed;
        color: #2ECC71;
        width: 30px;
        height: 40px;
        margin-top: 13px;
        margin-left: 22px;
        cursor: pointer;
    }

  @keyframes showSidebar {
    from {
      opacity: 0;
      width: 0;
    }
    to {
      opacity: 1;
      width: 300px;
    }
  }

button {
    width: 100%;
    background-color: #323848;
    transition: 0.3s;
    text-align: left;
    color: white;
    border: none;
    border-radius: 10px;
    padding: .8rem
}

button:hover {
    background-color: #2ECC71;
    border: none;
} 
`;

const Content = styled.div`
  margin-top: 100px;
`;

export default Sidebar
