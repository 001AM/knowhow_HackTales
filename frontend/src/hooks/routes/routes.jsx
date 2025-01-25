import BaseLayout from "../../layout/baselayout";
import Signup from "../../pages/signup/signup";
import Home from "../../pages/home/home";
import NotFound from "../../pages/notfound/notfound";
import Login from "../../pages/login/login";
import Marketplace from "../../pages/marketplace/marketplace";
import ProductPage from "../../pages/productpage/productpage";
import TravelPlan from "../../pages/travelplan/travelplan";
import Biodiversity from "../../pages/biodiversity/biodiversity";
import MetaMask from "../../pages/Metamask/MetaMask";
import VendorSignUp from "../../pages/vendor_signup/vendorsignup";
import BiodiversityBird from "../../pages/biodiversity/biodiversity_bird";
import BiodiversityLeaf from "../../pages/biodiversity/biodiversity_leaf";
import VendorProduct from "../../pages/vendor_product/vendor_product";
import VRView from "../../pages/vr/vr";
import Profile from "../../pages/profile/profile";
const routesConfig = [
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/vendorSignup",
    element: <VendorSignUp />,
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
        path: "/vr",
        element: <VRView />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/products/:id",
        element: <ProductPage />,
      },
      {
        path: "/travelplan",
        element: <TravelPlan />,
      },
      {
        path: "/biodiversity/bird",
        element: <BiodiversityBird />,
      },
      {
        path: "/biodiversity/leaf",
        element: <BiodiversityLeaf />,
      },
      {
        path: "/biodiversity",
        element: <Biodiversity />,
      },
      {
        path: "/profile/vendor/products",
        element: <VendorProduct />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routesConfig;
