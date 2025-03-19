import styled from 'styled-components';
import inteliLogo from '../assets/logo_inteli.svg';
import doseCertaLogo from '../assets/logo_dose_certa.svg';
import hcLogo from '../assets/logo_hc.svg';

const Footer = () => {
  return (
    <StyledFooter>
      <img src={inteliLogo} alt="Inteli Logo" className="footer-image" />
      <img src={doseCertaLogo} alt="Dose Certa Logo" className="footer-image" />
      <img src={hcLogo} alt="HC Logo" className="footer-image" />
    </StyledFooter>
  );
}

const StyledFooter = styled.footer`
  background-color: #323848;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px 20px;
  height: 10vh;
  margin-top: 2rem;
  width: 100%;

  .footer-image {
    height: 90%;
    max-height: 50px;
    
    @media (max-width: 576px) {
      height: 70%;
    }
  }
  
  @media (max-width: 576px) {
    flex-direction: column;
    gap: 10px;
    height: auto;
    padding: 15px;
  }
`;

export default Footer;
