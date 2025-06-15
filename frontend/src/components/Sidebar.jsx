import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiHome, FiGrid, FiUsers, FiLogIn, FiLogOut, FiUser } from "react-icons/fi";
import { jwtDecode } from "jwt-decode";
import "./Sidebar.css";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const isActive = (path) => currentPath === path;

  const token = localStorage.getItem("token");
  let user = null;
  if (token) {
    try {
      user = jwtDecode(token);
    } catch (err) {
      user = null;
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <h1 className="sidebar-logo">SiMaruk</h1>
        <ul className="menu-list">
          <li>
            <Link to="/Dashboard" className={isActive("/Dashboard") ? "active" : ""}>
              <FiGrid className="icon" /> Dashboard
            </Link>
          </li>
        </ul>
      </div>

      <div className="sidebar-bottom">
        {!user ? (
          <Link to="/login" className={isActive("/login") ? "active" : ""}>
            <FiLogIn className="icon" /> Login
          </Link>
        ) : (
          <>
            <button className="logout-btn" onClick={handleLogout}>
              <FiLogOut className="icon" /> Logout
            </button>
            <div className="user-profile">
              <Link to="/profil" className="user-info-link">
                <FiUser className="icon" />
                <div className="user-info">
                  <div className="username">{user.username || "User"}</div>
                  <small className="status">Status: {user.status || "Unknown"}</small>
                </div>
              </Link>
            </div>
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
