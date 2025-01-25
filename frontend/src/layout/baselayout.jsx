import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/footer/footer";
import Navbar from "../components/navbar/navbar";

function BaseLayout() {
  return (
    <>
      <div className="flex flex-col h-screen app-container">
        <nav className="top-0 w-full text-white absolute">
          <Navbar />
        </nav>
        <div className="w-full">
          <Outlet />
        </div>
        <Footer />
      </div>
    </>
  );
}

export default BaseLayout;
