import React, { useRef } from "react";

import { Container } from "reactstrap";
import { Link, NavLink } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import profileImage from "../../assets/all-images/profile.png";

import "../../styles/header.css";

const navLinks = [
  {
    path: "/home",
    display: "Home",
  },
  {
    path: "/about",
    display: "About",
  },
  {
    path: "/cars",
    display: "Cars",
  },

  {
    path: "/blogs",
    display: "Blog",
  },
  {
    path: "/contact",
    display: "Contact",
  },
];

const Header = () => {
  const menuRef = useRef(null);

  const toggleMenu = () => menuRef.current.classList.toggle("menu__active");

  const { user } = useAuthContext();

  if (user) {
    navLinks.push({
      path: "/profile",
      display: "Profile",
    });
  } else if (navLinks.some((link) => link.path === "/profile")) {
    navLinks.pop();
  }

  return (
    <header className="header">
      <div className="main__navbar">
        <Container>
          <div className="navigation__wrapper d-flex align-items-center justify-content-between">
            <span className="mobile__menu">
              <i className="ri-menu-line" onClick={toggleMenu}></i>
            </span>
            <div className="logo">
              <h1>
                <Link to="/home" className=" d-flex align-items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="40"
                    height="40"
                  >
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path
                      d="M19 20H5v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V11l2.48-5.788A2 2 0 0 1 6.32 4H17.68a2 2 0 0 1 1.838 1.212L22 11v10a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1zm1-7H4v5h16v-5zM4.176 11h15.648l-2.143-5H6.32l-2.143 5zM6.5 17a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm11 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"
                      fill="#fff"
                    />
                  </svg>
                  <span>Aaryan</span>
                </Link>
              </h1>
            </div>
            <div className="navigation" ref={menuRef} onClick={toggleMenu}>
              <div className="menu">
                {navLinks.map((item, index) => (
                  <NavLink
                    to={item.path}
                    className={(navClass) =>
                      navClass.isActive ? "nav__active nav__item" : "nav__item"
                    }
                    key={index}
                  >
                    {item.display}
                  </NavLink>
                ))}
              </div>
            </div>
            {user && (
              <div className="header__top__right d-flex align-items-center gap-3">
                <div className="profile__image">
                  <img src={profileImage} alt="profile" id="profile__image" />
                </div>
                {/* <span className="user-name">{user.email}</span> */}
              </div>
            )}

            {!user && (
              <div className="header__top__right d-flex align-items-center gap-3">
                <Link to="/login" className=" d-flex align-items-center gap-1">
                  <i className="ri-login-circle-line"></i> Login
                </Link>

                <Link to="/signup" className=" d-flex align-items-center gap-1">
                  <i className="ri-user-line"></i> Sign Up
                </Link>
              </div>
            )}
          </div>
        </Container>
      </div>
    </header>
  );
};

export default Header;
