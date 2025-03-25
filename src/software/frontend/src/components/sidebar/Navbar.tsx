import styled from 'styled-components';
import { useState } from 'react';
import { FaBars, FaUserAlt, FaHome, FaBell } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

function Header() {
    const [sidebar, setSidebar] = useState(false);
    const navigate = useNavigate();

    const showSidebar = () => setSidebar(!sidebar);

    const reconnect = async() => {
        try {
            const response = await fetch('http://127.0.0.1:5000/dobot/reconectar', {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error(`Erro ao chamar API: ${response.status}`);
            }

        } catch (error) {
            console.error('Erro na requisição:', error);
            window.alert('Erro ao mover o robô para a posição home');
        }
    }

    const addBin = () => {
        // substituir pelo caminho da tela de adição de bin, que até o momento ainda não foi criada
        window.alert('redirecionamento para a tela de adição de novo bin');
    }

    const backHome = async () => {
        // Colocar aqui a lógica para o robô voltar para a posição de home
        try {
            const response = await fetch('http://127.0.0.1:5000/dobot/home', {
                method: 'GET',
            });
    
            if (!response.ok) {
                throw new Error(`Erro ao chamar API: ${response.status}`);
            }
    
            const data = await response.json();
            window.alert(data.message);  // Exibe a resposta de sucesso do backend
    
        } catch (error) {
            console.error('Erro na requisição:', error);
            window.alert('Erro ao mover o robô para a posição home');
        }
    }
    

    const handleUserClick = () => {
        navigate('/login');
    }

    return (
        <Container>
            <Content>
                <MenuIconWrapper onClick={showSidebar}>
                    <StyledFaBars />
                </MenuIconWrapper>
                
                <RoboStatus>
                    <div className='home-icon' onClick={backHome}>
                        <FaHome />
                    </div>
                    <Connection>
                        <Status />
                        <p>Dobot</p>
                    </Connection>
                    <ActionButton onClick={reconnect}>Reconnect</ActionButton>
                    <ActionButton onClick={addBin}>+ Add bin</ActionButton>
                    <BellIcon>
                        <StyledFaBell />
                    </BellIcon>
                </RoboStatus>
                
                <UserIconWrapper onClick={handleUserClick}>
                    <StyledFaUserAlt />
                </UserIconWrapper>
            </Content>
            
            <SidebarOverlay $isOpen={sidebar} onClick={() => setSidebar(false)} />
            <SidebarContainer $isOpen={sidebar}>
                {sidebar && <Sidebar active={setSidebar} />}
            </SidebarContainer>
        </Container>
    );
};

const Container = styled.div`
    height: 70px;
    background-color: #323848;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    z-index: 1000;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Content = styled.div`
    display: flex;
    height: 100%;
    align-items: center;
    padding: 0 22px;
    position: relative;
`;

const MenuIconWrapper = styled.div`
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1010;
`;

const StyledFaBars = styled(FaBars)`
    color: #2ECC71;
    width: 30px;
    height: 30px;
    transition: transform 0.3s ease;

    &:hover {
        transform: scale(1.1);
    }
`;

const UserIconWrapper = styled.div`
    cursor: pointer;
    margin-left: auto;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const StyledFaUserAlt = styled(FaUserAlt)`
    color: #2ECC71;
    width: 30px;
    height: 30px;
    transition: transform 0.3s ease;

    &:hover {
        transform: scale(1.1);
    }
`;

const RoboStatus = styled.div`
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: #2ECC71;
    display: flex;
    align-items: center;
    border-radius: 20px;
    padding: 6px 14px;
    height: 60%;
    gap: 10px;
    white-space: nowrap;
    max-width: 80%;
    overflow-x: auto;
    scrollbar-width: none; /* Firefox */
    
    &::-webkit-scrollbar {
        display: none; /* Chrome, Safari, Edge */
    }
    
    .home-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: #323848;
        transition: transform 0.2s;
        
        &:hover {
            transform: scale(1.1);
        }
    }
    
    @media (max-width: 1100px) {
        position: relative;
        left: 0;
        top: 0;
        transform: none;
        margin: 0 12px;
        padding: 6px 10px;
        height: 50%;
    }
    
    @media (max-width: 768px) {
        display: none;
    }
`;

const Connection = styled.div`
    background-color: #323848;
    height: 28px;
    display: flex;
    align-items: center;
    border-radius: 10px;
    padding: 0 10px;
    color: #fff;
    gap: 6px;
    
    p {
        margin: 0;
        font-size: 14px;
        font-weight: 500;
    }
`;

const Status = styled.div`
    background-color: #4D925B;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
`;

const ActionButton = styled.button`
    border: none;
    border-radius: 5px;
    background-color: #323848;
    padding: 5px 10px;
    height: 28px;
    color: #FFF;
    cursor: pointer;
    transition: background-color 0.2s;
    flex-shrink: 0;
    font-size: 13px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
        background-color: #242a36;
    }
    
    @media (max-width: 1100px) {
        padding: 3px 6px;
        font-size: 12px;
    }
`;

const BellIcon = styled.div`
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 24px;
    width: 24px;
`;

const StyledFaBell = styled(FaBell)`
    color: #323848;
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    transition: transform 0.2s ease;

    &:hover {
        transform: scale(1.1);
    }
`;

// Use $ prefix for transient props to prevent them from being passed to the DOM
const SidebarContainer = styled.div<{ $isOpen: boolean }>`
    position: fixed;
    top: 0;
    left: 0;
    transform: translateX(${({ $isOpen }) => $isOpen ? '0' : '-100%'});
    transition: transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
    height: 100vh;
    z-index: 1006;
    width: 280px;
    box-shadow: ${({ $isOpen }) => $isOpen ? '2px 0 8px rgba(0, 0, 0, 0.2)' : 'none'};
    overflow-y: auto; /* Enable scrolling if needed */
    overscroll-behavior: contain; /* Prevent scroll chaining */
    
    /* Hide scrollbar for Chrome, Safari and Opera */
    &::-webkit-scrollbar {
        display: none;
    }
    
    /* Hide scrollbar for IE, Edge and Firefox */
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
`;

const SidebarOverlay = styled.div<{ $isOpen: boolean }>`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    visibility: ${({ $isOpen }) => $isOpen ? 'visible' : 'hidden'};
    opacity: ${({ $isOpen }) => $isOpen ? 1 : 0};
    transition: opacity 0.3s ease, visibility 0.3s ease;
    z-index: 1005;
`;

export default Header;
