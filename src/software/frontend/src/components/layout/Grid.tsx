import styled from 'styled-components';
import { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  fluid?: boolean;
}

const StyledContainer = styled.div<{ fluid: boolean }>`
  width: 100%;
  margin-right: auto;
  margin-left: auto;
  padding-right: 15px;
  padding-left: 15px;
  
  ${({ fluid }) => !fluid && `
    @media (min-width: 576px) {
      max-width: 540px;
    }
    
    @media (min-width: 768px) {
      max-width: 720px;
    }
    
    @media (min-width: 992px) {
      max-width: 960px;
    }
    
    @media (min-width: 1200px) {
      max-width: 1140px;
    }
  `}
`;

export const Container = ({ children, fluid = false }: ContainerProps) => {
  return <StyledContainer fluid={fluid}>{children}</StyledContainer>;
};

interface RowProps {
  children: ReactNode;
  gap?: number;
}

const StyledRow = styled.div<{ gap: number }>`
  display: flex;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;
  
  ${({ gap }) => gap && `
    gap: ${gap}px;
    
    @media (max-width: 576px) {
      gap: ${Math.max(8, gap / 2)}px;
    }
  `}
`;

export const Row = ({ children, gap = 0 }: RowProps) => {
  return <StyledRow gap={gap}>{children}</StyledRow>;
};

interface ColProps {
  children: ReactNode;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}

// Calculate grid sizes
const getColumnWidth = (span: number) => {
  if (!span) return '';
  const width = (span / 12) * 100;
  return `flex: 0 0 ${width}%; max-width: ${width}%;`;
};

const StyledCol = styled.div<ColProps>`
  position: relative;
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
  
  ${({ xs }) => xs && `
    ${getColumnWidth(xs)}
  `}
  
  @media (min-width: 576px) {
    ${({ sm }) => sm && getColumnWidth(sm)}
  }
  
  @media (min-width: 768px) {
    ${({ md }) => md && getColumnWidth(md)}
  }
  
  @media (min-width: 992px) {
    ${({ lg }) => lg && getColumnWidth(lg)}
  }
  
  @media (min-width: 1200px) {
    ${({ xl }) => xl && getColumnWidth(xl)}
  }
`;

export const Col = ({ children, xs, sm, md, lg, xl }: ColProps) => {
  return (
    <StyledCol xs={xs} sm={sm} md={md} lg={lg} xl={xl}>
      {children}
    </StyledCol>
  );
};
