import BaseLayout from "../../layout/baselayout";
import Signup from "../../pages/signup/signup";
import Home from "../../pages/home/home";
import NotFound from "../../pages/notfound/notfound";
import Login from "../../pages/login/login";
import Marketplace from "../../pages/marketplace/marketplace";
import ProductPage from "../../pages/productpage/prodoctpage";
import TravelPlan from "../../pages/travelplan/travelplan";
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
        path: "/marketplace",
        element: <Marketplace />,
      },
      {
        path: "/products/:pk",
        element: <ProductPage />,
      },
      {
        path: "/travelplan",
        element: <TravelPlan />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routesConfig;
