import BaseLayout from "../../layout/baselayout";
import Signup from "../../pages/signup/signup";
import Home from "../../pages/home/home";
import NotFound from "../../pages/notfound/notfound";
import Login from "../../pages/login/login";
const routesConfig = [
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "", // Use an empty string for the root route
    element: <BaseLayout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "/home1",
        element: <Home />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routesConfig;
