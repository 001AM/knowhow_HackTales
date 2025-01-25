import { useState, useContext } from "react";
import styles from "./navbar.module.css";
import { navbarItems } from "../../utils/constants";
import Context from "../../context/context";
import { Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const { isLogin, setLogin } = useContext(Context);
  console.log(isLogin);
  const logout = () => {
    localStorage.setItem("access_token", "");
    localStorage.setItem("refresh_token", "");
    setLogin(false);
    navigate("/login");
  };
  return (
    <nav className={styles["navbar-container"]}>
      <Text fontSize="2xl" fontWeight="extrabold">
        EcoVoyage
      </Text>
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
          <button
            onClick={logout}
            style={{
              padding: "8px 16px",
              backgroundColor: "#ff4d4f",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Logout
          </button>
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
