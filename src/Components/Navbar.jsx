import React from "react";
import { Navbar as BootstrapNavbar, Container } from "react-bootstrap";
import './Navbar.css';

function Navbar() {
  return (
    <BootstrapNavbar bg="primary" variant="dark" className="py-3">
      <Container className="justify-content-center">
        <BootstrapNavbar.Brand
          href="#"
          className="navbar-brand-custom"
        >
          Quiz App
        </BootstrapNavbar.Brand>
      </Container>
    </BootstrapNavbar>
  );
}

export default Navbar;
