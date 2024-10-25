import React from 'react';
import { Container, Row, Col, Navbar, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram, faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import './Footer.scss'; // Import your custom styles

function Footer() {
  return (
    <footer className="footer bg-info">
      <Container >
        <Row>
          <Col md={6}>
            <h5>Contact Us</h5>
            <p>Email: info@example.com</p>
            <p>Phone: (123) 456-7890</p>
          </Col>
          <Col md={6}>
            <h5>Follow Us</h5>
            <Navbar style={{ backgroundColor: 'transparent', border: 'none' }}>
              <Nav>
                <Nav.Link href="#" className="social-icon"><FontAwesomeIcon icon={faFacebook} size="2x" /></Nav.Link>
                <Nav.Link href="#" className="social-icon"><FontAwesomeIcon icon={faTwitter}  size="2x"/></Nav.Link>
                <Nav.Link href="#" className="social-icon"><FontAwesomeIcon icon={faInstagram} size="2x"/></Nav.Link>
                <Nav.Link href="#" className="social-icon"><FontAwesomeIcon icon={faLinkedin} size="2x"/></Nav.Link>
                <Nav.Link href="#" className="social-icon"><FontAwesomeIcon icon={faGithub} size="2x"/></Nav.Link>
              </Nav>
            </Navbar>
          </Col>
        </Row>
        <hr />
        <p className="text-center">© 2024 OurRecipe</p>
      </Container>
    </footer>
  );
}

export default Footer;
