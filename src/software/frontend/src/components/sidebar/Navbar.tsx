import styled from 'styled-components';
import { useState } from 'react';
import sanduiche from '../../assets/sanduiche.svg';
import profilePic from '../../assets/profilePic.svg';
import Sidebar from './Sidebar'; 

const Navbar = () => {
    const [sidebar, setSidebar] = useState(false);

    const handleSidebar = () => {
        setSidebar(prevState => !prevState);
    };

    return (
        <div className='body'>
        <StyledWrapper>   
        <div className='navbar'>
            <img src={sanduiche} className='sanduiche' onClick={handleSidebar} alt="Menu" />
            <img src={profilePic} className='profile-pic' alt="Perfil" />

        </div> 

        {sidebar ? <Sidebar /> : <div />}
        </StyledWrapper> 
        </div>
    );
};

const StyledWrapper = styled.div`
.navbar {
    background-color: #323848;
    width: 100vw;
    height: 6vh;
    
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    overflow: hidden;
}

.sanduiche {
    margin: 0;
    padding: .7rem 1rem;
}

.profile-pic {
    margin: 0;
    padding: .5rem 1rem;
}

.navbar img:hover {
    cursor: pointer;
}
`

export default Navbar;
