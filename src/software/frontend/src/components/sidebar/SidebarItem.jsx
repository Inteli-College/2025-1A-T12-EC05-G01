import React from 'react'
import styled from 'styled-components'

const SidebarItem = ({ Text, Path }) => {
    return(
        <Container>
            <button onClick={() => window.location.href = Path}>{Text}</button>
        </Container>
    )
}
export default SidebarItem

const Container = styled.div`
    display: flex;
    align-itens: center;
    font-size: 20px;
    color: white;
    padding: 10px;
    cursor: pointer;
    border-radius: 10px;
    margin: 0 15px 20px;

    > svg {
        margin: 0 20px;
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
