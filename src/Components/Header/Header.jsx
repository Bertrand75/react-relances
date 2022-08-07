import React from "react";
import { NavLink } from "react-router-dom";
import Navigation from "./Navigation/Navigation";
import logoLink from "./../../Images/newspaper.svg";
import UserLogin from "./UserLogin/UserLogin";
import LanguageVersion from "./LanguageVersion/LanguageVersion";
import styles from "./Header.module.css";

function Header() {
  return (
    <header>
      <div className={styles.logoAndTitle}>
        <NavLink to="/">
          <img className={styles.logo} src={logoLink} alt="logo" />
        </NavLink>
        <h1 className={styles.mainTitle}>Relances</h1>
        <UserLogin />
        <LanguageVersion />
      </div>
      <Navigation styleNav={"header"} />
    </header>
  );
}

export default Header;
