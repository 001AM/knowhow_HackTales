import {
  Box,
  Button,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../axios/axiosInstance";
import Context from "../../context/context";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer/footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const navigate = useNavigate();
  const { isLogin, setLogin, setVendor } = React.useContext(Context);
  const [show, setShow] = React.useState(false);
  const [formData, setFormData] = React.useState({
    username: "",
    password: "",
  });
  const handleClick = () => setShow(!show);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  React.useEffect(() => {
    console.log(isLogin);
    if (isLogin) {
      navigate("/");
    }
  }, [isLogin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Sending login request...");
      const requestData = new FormData();
      requestData.append("username", formData.username);
      requestData.append("password", formData.password);
      const response = await axiosInstance.post("/login/", requestData);
      console.log("Full response:", response);
      console.log("Response data:", response?.data.data.access);

      if (response.data.data.access && response.data.data.refresh) {
        localStorage.setItem("access_token", response.data.data.access);
        localStorage.setItem("refresh_token", response.data.data.refresh);
        setLogin(true);
        setVendor(response.data.data.is_vendor);
        toast.success("Login successful!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      console.log("Error response:", error.response);
      toast.error("Login failed. Please check your credentials.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Navbar />
      <Box display="flex">
        <Box width="50%" display="flex" justifyContent="center">
          <Image src="/login1.png" alt="login" />
        </Box>
        <Box
          width="50%"
          height="630px"
          display="flex"
          alignItems="center"
          flexDirection="column"
          pt="10%"
        >
          <Text fontSize="4xl" fontWeight="bold">
            Please Login to Continue
          </Text>
          <Box>
            <Input
              placeholder="Username"
              mt="10%"
              width="400px"
              focusBorderColor="green"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
            <InputGroup mt="5%" width="100%" focusBorderColor="green">
              <Input
                pr="4.5rem"
                type={show ? "text" : "password"}
                placeholder="Password"
                focusBorderColor="green"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleClick}>
                  {show ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
            <Button
              colorScheme="green"
              width="100%"
              mt="10%"
              onClick={handleSubmit}
            >
              Login
            </Button>
            <Box display="flex" gap="5px" justifyContent="center" mt="2%">
              <Text> New to EcoVoyage?</Text>
              <Link to="/signup" color="blue">
                {" "}
                <Text color="blue">SignUp</Text>{" "}
              </Link>
              <Text>Now!!</Text>
            </Box>
          </Box>
        </Box>
      </Box>
      <Footer />
    </>
  );
}
