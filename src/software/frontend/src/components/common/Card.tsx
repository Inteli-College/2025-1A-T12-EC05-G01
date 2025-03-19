import React, { ReactNode } from 'react';
import styled from 'styled-components';

interface CardProps {
  children: ReactNode;
  background?: string;
  color?: string;
  padding?: string;
  margin?: string;
  className?: string;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  background = '#34495E',
  color = '#FFFFFF',
  padding = '1.5rem',
  margin = '0 0 1rem 0',
  className 
}) => {
  return (
    <CardContainer 
      background={background}
      color={color}
      padding={padding}
      margin={margin}
      className={className}
    >
      {children}
    </CardContainer>
  );
};

const CardContainer = styled.div<{
  background: string;
  color: string;
  padding: string;
  margin: string;
}>`
  background-color: ${props => props.background};
  color: ${props => props.color};
  padding: ${props => props.padding};
  margin: ${props => props.margin};
  border-radius: 15px;
  width: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export default Card;
