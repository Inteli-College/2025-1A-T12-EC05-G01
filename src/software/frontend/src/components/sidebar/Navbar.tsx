import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { FaBars, FaUserAlt, FaHome, FaBell } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import mqtt, { MqttClient } from 'mqtt';

let DOBOT_URL = "http://127.0.0.1:5000";

function Header() {
    const [sidebar, setSidebar] = useState(false);
    const [dobotStatus, setDobotStatus] = useState<'conectado' | 'desconectado'>('desconectado');
    const [mqttClient, setMqttClient] = useState<MqttClient | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const client = mqtt.connect('ws://broker.emqx.io:8083/mqtt', {
            clientId: `webClient_${Math.random().toString(16).substr(2, 8)}`,
            clean: true,
            reconnectPeriod: 1000,
            connectTimeout: 30000,
        });

        client.on('connect', () => {
            console.log('Conectado ao broker MQTT');
            client.subscribe('dobot/status', (err) => {
                if (!err) console.log('Inscrito no tópico dobot/status');
            });
        });

        client.on('message', (topic, message) => {
            if (topic === 'dobot/status') {
                try {
                    const payload = JSON.parse(message.toString());
                    setDobotStatus(payload.status.toLowerCase());
                } catch (error) {
                    console.error('Erro ao processar mensagem:', error);
                }
            }
        });

        client.on('error', (err) => {
            console.error('Erro MQTT:', err);
        });

        setMqttClient(client);

        return () => {
            client.end();
        };
    }, []);

    const showSidebar = () => setSidebar(!sidebar);

    const reconnect = () => {
        fetch(`${DOBOT_URL}/dobot/reconectar`)
            .then(response => {
                if (!response.ok) throw new Error('Falha na rede');
                return response.json();
            })
            .then(data => {
                const message = data.message || data.status;
                window.alert(message.includes('conectado') ? 'Dobot conectado' : 'Falha na conexão');
            })
            .catch(error => {
                console.error('Erro:', error);
                window.alert('Erro ao reconectar');
            });
    };


    const addBin = () => {
        navigate('/adicionar-bin');
    }

    const backHome = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/dobot/home', {
                method: 'GET',
            });
    
            if (!response.ok) {
                const errorMessage = await response.text(); // Aqui pode ocorrer o problema
                throw new Error(`Erro ao chamar API: ${response.status} - ${errorMessage}`);
            }
    
            const data = await response.json();
            if (data && data.message) {
                window.alert(data.message);
            } else {
                window.alert('Robô movido para a posição home com sucesso!');
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            window.alert('Erro ao mover o robô para a posição home');
        }
    };
    

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
                        <Status $isConnected={dobotStatus === 'conectado'} />
                        <p>Dobot</p>
                    </Connection>
                    <ActionButton onClick={reconnect}>Reconectar</ActionButton>
                    <ActionButton onClick={addBin}>+ Adicionar Bin</ActionButton>
                    <BellIcon onClick={() => navigate('/fita')}>
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
}


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
    scrollbar-width: none;

    &::-webkit-scrollbar {
        display: none;
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

const Status = styled.div<{ $isConnected: boolean }>`
    background-color: ${({ $isConnected }) => $isConnected ? '#4D925B' : '#ff4d4d'};
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
    transition: background-color 0.3s ease;
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
    overflow-y: auto;
    overscroll-behavior: contain;
    
    &::-webkit-scrollbar {
        display: none;
    }
    
    -ms-overflow-style: none;
    scrollbar-width: none;
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