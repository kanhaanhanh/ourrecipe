import React from "react";
import { Link } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { useUserAuth } from '../../contexts/UserContext/UserContext';
import "./SettingDropdown.scss";

function SettingDropdown() {
    const { logOut } = useUserAuth();
    const handleLogout = async () => {
        try {
          await logOut();
          navigate("/");
        } catch (error) {
          console.log(error.message);
        }
      };
  return (
    <Dropdown className="d-inline mx-2 custom-dropdown alignLeft">
      <Dropdown.Toggle
        variant="link"
        style={{ cursor: "pointer", color: "#121212", margin: "0 2px 0 0"}}
        className="Setting"
        
      >
        <FontAwesomeIcon icon={faBars} size="lg" />
      </Dropdown.Toggle>
      <Dropdown.Menu className="dropdown-menu">
        <Dropdown.Item><Link to="/About-Us" className="dropdown-item">About Us</Link></Dropdown.Item>
        <Dropdown.Item><Link to="/addRecipe" className="dropdown-item">Add Recipe</Link></Dropdown.Item>
        <Dropdown.Item><Link to="/favourite" className="dropdown-item">Favourite</Link></Dropdown.Item>
        <Dropdown.Item><Link to="/My-Drive" className="dropdown-item">My Drive</Link></Dropdown.Item>
        <Dropdown.Item><Link to="/user-profile" className="dropdown-item">Account </Link></Dropdown.Item>
        <hr />
        <Dropdown.Item onClick={handleLogout}><Link to="/" className="dropdown-item">Log Out</Link></Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default SettingDropdown;
