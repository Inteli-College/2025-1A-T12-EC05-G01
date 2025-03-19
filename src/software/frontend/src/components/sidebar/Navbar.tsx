import styled from 'styled-components';
import { useState } from 'react';
import { FaBars, FaUserAlt, FaHome, FaBell } from 'react-icons/fa'
import Sidebar from './Sidebar';

function Header() {
    const [sidebar, setSidebar] = useState(false);

    const showSidebar = () => setSidebar(!sidebar);

    const recconect = () => {
        // Adicionar futuramente a função de reconexão com o robô
        window.alert('Reconexão com o robô concluída')
    }

    const addBin = () => {
        //substituir pelo caminho da tela de adição de bin, que até o momento ainda não foi criada
        window.alert('redirecionamento para a tela de adição de novo bin') 
    }

    const backHome = () => {
        //Colocar aqui a lógica para o robô voltar para a posição de home
        window.alert('Robô redirecionado para a posição de Home')
    }

    return (
        <Container className="container">
            <div className="content">
                <FaBars onClick={showSidebar} className='fabars' />
                <div className="acompanhamento-robo">
                    <FaHome className='home-icon' onClick={ backHome } />
                    <div className="connection">
                        <div className="status"></div>
                        <p>Dobot</p>
                    </div>
                    <button onClick={recconect} >Recconect</button>
                    <button onClick={ addBin } > + Add bin </button>
                    <FaBell className='bell-icon' />
                </div>
                <FaUserAlt className='fauseralt' onClick={() => { window.location.href = '/login' }} />
            </div>
            {sidebar && <Sidebar active={setSidebar} />}
        </Container>
    );
};

const Container = styled.div`
    height: 70px;
    background-color: #323848;
    z-index: 1;

    .content {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        position: relative;
        height: 100%;
        align-items: center;
    }
    

    .fabars {
        position: fixed;
        color: #2ECC71;
        width: 30px;
        height: 40px;
        margin-left: 22px;
        cursor: pointer;
    }

    .acompanhamento-robo {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 20%;
        height: 60%;
        background-color: #2ECC71;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-radius: 20px;
        padding: 0 1rem;
    }

    .acompanhamento-robo button {
        border: none;
        border-radius: 5px;
        background-color: #323848;
        padding: .5rem;
        color: #FFF;
    }

    .connection {
        background-color: #323848;
        height: 60%;
        
        display: flex;
        flex-direction: row;
        align-items: center;
        border-radius: 10px;
        padding: .1rem .5rem;
        color: #fff;
        gap: .2rem;
    }

    .status {
        background-color: #4D925B;
        width: 12px;
        height: 12px;
        border-radius: 50%; 
    }

    .home-icon {
        color: #323848;
        width: 2rem;
        height: 3rem;
    }

    .bell-icon {
        color: #323848;
        width: 1.5rem;
        height: 2rem;
    }

    .fauseralt {
        position: fixed;
        right: 0%;
        color: #2ECC71;
        width: 30px;
        height: 40px;
        margin-right: 22px;
        cursor: pointer;
    }


`

export default Header;
