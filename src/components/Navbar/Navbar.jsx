import React, { useState } from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import './Navbar.scss';
import { Link } from 'react-router-dom';
import Logo from '../../assets/Logo.PNG';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import SettingDropdown from '../Dropdown/SettingDropdown';
import SearchBar from "../SearchBar/SearchBar";

function AppNavbar({ handleSearch }) {
  const [showDropdown3, setShowDropdown3] = useState(false);
  const [showCuisine, setShowCuisine] = useState(false);
  const [showSeasonal, setShowSeasonal] = useState(false);
  const [showBakery, setShowBakery] = useState(false);

  const handleMouseEnter = (dropdownName) => {
    switch (dropdownName) {
      case 'healthyxdiet':
        setShowDropdown3(true);
        break;
      case 'cuisine':
        setShowCuisine(true);
        break;
      case 'seasonal':
        setShowSeasonal(true);
        break;
      case 'bakery':
        setShowBakery(true);
        break;
      default:
        break;
    }
  };

  const handleMouseLeave = (dropdownName) => {
    switch (dropdownName) {
      case 'healthyxdiet':
        setShowDropdown3(false);
        break;
      case 'cuisine':
        setShowCuisine(false);
        break;
      case 'seasonal':
        setShowSeasonal(false);
        break;
      case 'bakery':
        setShowBakery(false);
        break;
      default:
        break;
    }
  };

  return (
    <Navbar bg="info" expand="lg" className="shadow-sm p-2 mb-5 rounded navbar">
      <Navbar.Brand as={Link} to="/">
        <img src={Logo} alt="Logo" className="Recipe-logo ml-auto" />
        <span className="Brand-name">OurRecipe</span>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="navbarNav" />
      <Navbar.Collapse id="navbarNav">
        <Nav className="ms-auto">
          <Nav.Link as={Link} to="/" className='p-2 dropdown-style mt-2'>HOME</Nav.Link>
          <NavDropdown
            title="HEALTHY and DIET"
            id="healthyxdiet"
            className='p-2 dropdown-style'
            show={showDropdown3}
            onMouseEnter={() => handleMouseEnter('healthyxdiet')}
            onMouseLeave={() => handleMouseLeave('healthyxdiet')}
          >
            <NavDropdown.Item as={Link} to="/health_1">Vegetarian/Vegan</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/health_2">Low-Carb/Keto</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/health_3">Paleo</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/health_4">Dairy-Free</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/health_5">Heart-Healthy</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/health_6">Weight Management</NavDropdown.Item>
          </NavDropdown>
          <NavDropdown
            title="CUISINE"
            id="cuisine"
            className='p-2 dropdown-style'
            show={showCuisine}
            onMouseEnter={() => handleMouseEnter('cuisine')}
            onMouseLeave={() => handleMouseLeave('cuisine')}
          >
            <NavDropdown.Item as={Link} to="/cuisine1">Khmer Cuisine</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/cuisine2">Asian Cuisine</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/cuisine3">European Cuisine</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/cuisine4">American Cuisine</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/cuisine5">South American Cuisine</NavDropdown.Item>
          </NavDropdown>
          <NavDropdown
            title="SEASONAL"
            id="seasonal"
            className='p-2 dropdown-style'
            show={showSeasonal}
            onMouseEnter={() => handleMouseEnter('seasonal')}
            onMouseLeave={() => handleMouseLeave('seasonal')}
          >
            <NavDropdown.Item as={Link} to="/seasonal1">Summer</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/seasonal2">Spring</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/seasonal3">Fall</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/seasonal4">Winter</NavDropdown.Item>
          </NavDropdown>
          <NavDropdown
            title="BAKERY"
            id="bakery"
            className='p-2 dropdown-style'
            show={showBakery}
            onMouseEnter={() => handleMouseEnter('bakery')}
            onMouseLeave={() => handleMouseLeave('bakery')}
          >
            <NavDropdown.Item as={Link} to="/bakery1">Breads</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/bakery2">Cakes</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/bakery3">Pastries</NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/bakery4">Cookies</NavDropdown.Item>
          </NavDropdown>
          <Nav.Link as={Link} to="/other" className='p-2 dropdown-style mt-2'>OTHERS</Nav.Link>
          <li className="nav-item search">
            <SearchBar handleSearch={handleSearch} />
          </li>
          <li className="nav-item">
            {/* Link to login page */}
            <Link to="/login" className="nav-link p-2 mt-2">LOGIN</Link>
          </li>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default AppNavbar;
