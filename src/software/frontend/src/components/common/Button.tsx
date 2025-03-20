import React, { ReactNode, ButtonHTMLAttributes } from 'react';
import styled from 'styled-components';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  ...props
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

const StyledButton = styled.button<{
  variant: string;
  size: string;
  fullWidth: boolean;
}>`
  /* Variant styles */
  ${props => {
    switch (props.variant) {
      case 'success':
        return `
          background-color: #2ECC71;
          &:hover {
            background-color: #26dd72;
          }
        `;
      case 'secondary':
        return `
          background-color: #7f8c8d;
          &:hover {
            background-color: #6c7a7a;
          }
        `;
      case 'warning':
        return `
          background-color: #E9B78A;
          &:hover {
            background-color: #E67E22;
          }
        `;
      case 'danger':
        return `
          background-color: #e74c3c;
          &:hover {
            background-color: #c0392b;
          }
        `;
      default: // primary
        return `
          background-color: #34495E;
          &:hover {
            background-color: #2C3E50;
          }
        `;
    }
  }}

  /* Size styles */
  ${props => {
    switch (props.size) {
      case 'small':
        return `
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
        `;
      case 'large':
        return `
          padding: 1rem 1.5rem;
          font-size: 1.125rem;
        `;
      default: // medium
        return `
          padding: 0.75rem 1.25rem;
          font-size: 1rem;
        `;
    }
  }}

  width: ${props => props.fullWidth ? '100%' : 'auto'};
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export default Button;
