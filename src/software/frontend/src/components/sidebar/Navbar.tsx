import styled from 'styled-components';
import { useState } from 'react';
import { FaBars, FaUserAlt } from 'react-icons/fa'
import Sidebar from './Sidebar'; 

const Header = () => {
    const [sidebar, setSidebar] = useState(false);

    const showSidebar = () => setSidebar(!sidebar)

    return (
        <Container className="container">
            <FaBars onClick={showSidebar} className='fabars'/>
            <FaUserAlt className='fauseralt' onClick={() => {window.location.href='/login'}}/>
            {sidebar && <Sidebar active={setSidebar} />}
            
        </Container>
    );
};

const Container = styled.div`
    height: 70px;
    display: flex;
    background-color: #323848;
    z-index: 1;
    

    .fabars {
        position: fixed;
        color: #2ECC71;
        width: 30px;
        height: 40px;
        margin-top: 13px;
        margin-left: 22px;
        cursor: pointer;
    }

    .fauseralt {
        position: fixed;
        right: 0%;
        color: #2ECC71;
        width: 30px;
        height: 40px;
        margin-top: 13px;
        margin-right: 22px;
        cursor: pointer;
    }
`

export default Header;
