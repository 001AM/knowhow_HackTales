import { useState, useContext } from "react";
import styles from "./navbar.module.css";
import { navbarItems } from "../../utils/constants";
import Context from "../../context/context";

const Navbar = () => {
  const { isLogin } = useContext(Context);
  console.log(isLogin);

  return (
    <nav className={styles["navbar-container"]}>
      {isLogin ? (
        <div className={styles["navbar-items"]}>
          {navbarItems.map((item) => (
            <a
              key={item.name}
              className={styles["navbar-item"]}
              href={item.url}
              style={{
                display: item.isLoggedInShow ? "block" : "none",
                color: "white",
              }}
            >
              {item.title}
            </a>
          ))}
          <div>HHHH</div>
        </div>
      ) : (
        <div className={styles["navbar-items"]}>
          {navbarItems.map((item) => (
            <a
              key={item.name}
              className={styles["footer-item"]}
              href={item.url}
              style={{
                color: "white",
              }}
            >
              {item.title}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
