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

  .footer-image {
    height: 90%;
  }
`;

export default Footer;
