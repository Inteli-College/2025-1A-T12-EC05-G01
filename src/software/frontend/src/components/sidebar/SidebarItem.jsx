import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const SidebarItem = ({ Text, Path, onClick }) => {
    const navigate = useNavigate();
    
    const handleClick = () => {
        navigate(Path);
        if (onClick) {
            onClick();
        }
    };
    
    return (
        <Container>
            <StyledButton onClick={handleClick}>{Text}</StyledButton>
        </Container>
    );
};


const Container = styled.div`
    display: flex;
    align-items: center;
    font-size: 20px;
    color: white;
    padding: 10px;
    cursor: pointer;
    border-radius: 10px;
    margin: 0 15px 20px;
`;

const StyledButton = styled.button`
    width: 100%;
    background-color: #323848;
    transition: 0.3s;
    text-align: left;
    color: white;
    border: none;
    border-radius: 10px;
    padding: .8rem;
    cursor: pointer;
    font-size: inherit;
    
    &:hover {
        background-color: #2ECC71;
    } 
    
    &:focus {
        outline: none;
    }
`;

export default SidebarItem;