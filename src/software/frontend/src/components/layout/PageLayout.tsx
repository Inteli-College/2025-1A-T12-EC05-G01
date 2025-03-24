import React, { ReactNode } from 'react';
import styled from 'styled-components';
import Navbar from '../sidebar/Navbar';
import Footer from '../Footer';

interface PageLayoutProps {
  children: ReactNode;
  title: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, title }) => {
  return (
    <PageContainer>
      <nav><Navbar /></nav>
      <PageContent>
        <PageHeader>
          <h1>{title}</h1>
        </PageHeader>
        {children}
        <footer><Footer /></footer>
      </PageContent>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 0 15px;
  min-height: calc(100vh - 70px); /* Ensures footer stays at bottom */
  margin-top: 70px; /* Added to account for fixed navbar */
`;

const PageHeader = styled.div`
  width: 90%;
  max-width: 1200px;
  padding: 0 15px;
  margin: 2rem 0 1rem;
  
  h1 {
    color: #34495E;
    font-size: clamp(24px, 5vw, 36px);
    font-weight: 900;
  }
`;

export default PageLayout;
