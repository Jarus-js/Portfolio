import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
//action
import { logout } from "../../actions/authAction";

const Navbar = ({ isAuthenticated, logout }) => {
  const guestLinks = (
    <ul>
      <li>
        <Link to="/register">Register</Link>
      </li>
      <li>
        <Link to="/login">Login</Link>
      </li>
    </ul>
  );

  const authLinks = (
    <ul>
      <li>
        <Link to="/">Developers</Link>
      </li>
      <li>
        <Link to="/logout" onClick={logout}>
          Logout
        </Link>
      </li>
    </ul>
  );
  return (
    <>
      <nav className="navbar bg-dark">
        <h1>
          <Link to="/">
            <i className="fas fa-code"></i> DevConnector
          </Link>
        </h1>
        {isAuthenticated ? authLinks : guestLinks}
      </nav>
    </>
  );
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { logout })(Navbar);
