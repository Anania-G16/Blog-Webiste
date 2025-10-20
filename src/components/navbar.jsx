import { Link } from "react-router-dom";
import { useState } from "react";
import "../styles/navbar.css";
import React from "react";
function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="nav-container">
      <div className="logo">UBlog</div>
      <div className="nav-links">
        <Link className="nav-item" to="/view">
          Read
        </Link>
        <Link className="nav-item" to="/create">
          Create
        </Link>
        {/* <Link className="nav-item" to="/view">
          About
        </Link> */}
      </div>

      <div className="dropdown-container">
        <img className="profile-img" src="/profile.png" alt="Profile" />
        <div className="dropdown-menu">
          <div className="dropdown-item">
            Logoutdaffffffffffffffffffffvcvadg
          </div>
        </div>
      </div>
    </div>
  );
}
export default Navbar;
