import React, { ReactNode } from 'react';
import styled from 'styled-components';

interface SectionProps {
  children: ReactNode;
  title?: string;
  width?: string;
  className?: string;
}

const Section: React.FC<SectionProps> = ({ children, title, width = '90%', className }) => {
  return (
    <SectionContainer width={width} className={className}>
      {title && <SectionTitle>{title}</SectionTitle>}
      {children}
    </SectionContainer>
  );
};

const SectionContainer = styled.section<{ width: string }>`
  width: ${props => props.width};
  max-width: 1200px;
  margin: 1rem 0 2.5rem;
  display: flex;
  flex-direction: column;
`;

const SectionTitle = styled.h3`
  color: #34495E;
  font-size: clamp(20px, 4vw, 28px);
  font-weight: 700;
  margin-bottom: 1rem;
`;

export default Section;
