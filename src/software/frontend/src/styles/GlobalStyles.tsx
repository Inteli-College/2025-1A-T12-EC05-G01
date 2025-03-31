import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body {
    height: 100%;
    width: 100%;
    overflow-x: hidden;
  }

  body {
    font-family: 'Montserrat', sans-serif;
    font-size: 16px;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #ECF0F1;
  }

  img, picture, video, canvas, svg {
    display: block;
    max-width: 100%;
  }

  button, input, select, textarea {
    font: inherit;
  }

  p, h1, h2, h3, h4, h5, h6 {
    overflow-wrap: break-word;
  }

  /* Responsive text sizes */
  h1 {
    font-size: clamp(1.75rem, 5vw, 3rem);
  }
  
  h2 {
    font-size: clamp(1.5rem, 4vw, 2.5rem);
  }
  
  h3 {
    font-size: clamp(1.25rem, 3vw, 2rem);
  }
  
  /* Utility classes for responsive layouts */
  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 15px;
  }
  
  .flex-row {
    display: flex;
    flex-direction: row;
    
    @media (max-width: 768px) {
      flex-direction: column;
    }
  }
  
  .flex-column {
    display: flex;
    flex-direction: column;
  }
  
  /* Spacing utilities */
  .my-1 { margin-top: 0.5rem; margin-bottom: 0.5rem; }
  .my-2 { margin-top: 1rem; margin-bottom: 1rem; }
  .my-3 { margin-top: 1.5rem; margin-bottom: 1.5rem; }
  
  .mx-1 { margin-left: 0.5rem; margin-right: 0.5rem; }
  .mx-2 { margin-left: 1rem; margin-right: 1rem; }
  .mx-3 { margin-left: 1.5rem; margin-right: 1.5rem; }

  /* Media query breakpoints for reference */
  /* 
    --xs: 0px;
    --sm: 576px;
    --md: 768px;
    --lg: 992px;
    --xl: 1200px;
    --xxl: 1400px;
  */
`;

export default GlobalStyles;
