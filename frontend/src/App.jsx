import React, { useState } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import routesConfig from "./hooks/routes/routes";
import State from "./context/State"; // Import AuthContext
import "./App.css";
import "./index.css";
const App = () => {
  return (
    <ChakraProvider>
      <State>
        <BrowserRouter>
          <Routes>
            {routesConfig.map((route, index) => (
              <Route key={index} path={route.path} element={route.element}>
                {route.children &&
                  route.children.map((childRoute, childIndex) => (
                    <Route
                      key={childIndex}
                      path={childRoute.path}
                      element={childRoute.element}
                    />
                  ))}
              </Route>
            ))}
          </Routes>
        </BrowserRouter>
      </State>
    </ChakraProvider>
  );
};

export default App;
