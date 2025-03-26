import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';

interface SidebarProps {
  active: (isActive: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ active }) => {
  const closeSidebar = () => {
    active(false);
  };

  return (
    <Container>
      <CloseIconWrapper onClick={closeSidebar}>
        <FaTimes />
      </CloseIconWrapper>
      
      <SidebarItems>
        <SidebarItem to="/dashboard" onClick={closeSidebar}>
          Dashboard
        </SidebarItem>
        <SidebarItem to="/prescricoes" onClick={closeSidebar}>
          Prescrições
        </SidebarItem>
        <SidebarItem to="/montagens" onClick={closeSidebar}>
          Montagens
        </SidebarItem>
        <SidebarItem to="/adicionar-prescricao" onClick={closeSidebar}>
          Adicionar Prescrição
        </SidebarItem>
        <SidebarItem to="/verificacao" onClick={closeSidebar}>
          Verificação
        </SidebarItem>
        <SidebarItem to="/estoque" onClick={closeSidebar}>
          Estoque
        </SidebarItem>
      </SidebarItems>
    </Container>
  );
};

const Container = styled.div`
  background-color: #323848;
  width: 280px;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 0;
  position: relative;
`;

const CloseIconWrapper = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  cursor: pointer;
  color: #2ECC71;
  font-size: 1.5rem;
  z-index: 10;
`;

const SidebarItems = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
  flex: 1;
`;

const SidebarItem = styled(Link)`
  color: white;
  text-decoration: none;
  padding: 1rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.2s;
  
  &:hover {
    background-color: #2ECC71;
    color: #323848;
  }
`;

export default Sidebar;
