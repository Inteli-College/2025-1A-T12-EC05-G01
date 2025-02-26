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
        <div className='navbar'>
            <img src={sanduiche} className='sanduiche' onClick={handleSidebar} alt="Menu" />
            <img src={profilePic} className='profile-pic' alt="Perfil" />

        </div> 

        {sidebar ? <Sidebar /> : <div />}
        </div>
    );
};

export default Navbar;
