import {
    Box,
    Button,
    Checkbox,
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
  
  export default function VendorSignUp() {
    const navigate = useNavigate();
    const { isLogin, setLogin,setVendor } = React.useContext(Context);
    const [formData, setFormData] = React.useState({
      username: "",
      email: "",
      password: "",
      confirmpassword: "",
      first_name: "",
      last_name: "",
      country: "",
      city: "",
      pincode: "",
      number: "",
      gstin_no : ""
    });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        console.log("Sending registration request...");
        const response = await axiosInstance.post("/register/", {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          confirmpassword: formData.confirmpassword,
          country: formData.country,
          city: formData.city,
          first_name: formData.first_name,
          last_name: formData.last_name,
          pincode: formData.pincode,
          gstin_no:formData.gstin_no,
          is_vendor: true,
          phone_number: formData.number,
        });
        console.log("Full response:", response);
        console.log("Response data:", response?.data.data.access);
  
        if (response.data.data.access && response.data.data.refresh) {
          // authContext.setTokens(
          //   response.data.data.access,
          //   response.data.data.refresh,
          // );
          localStorage.setItem("access_token", response.data.data.access);
          localStorage.setItem("refresh_token", response.data.data.refresh);
          setLogin(true);
          setVendor(true);
          navigate("/");
        }
      } catch (error) {
        console.error("Registration error:", error);
        console.log("Error response:", error.response);
      }
    };
  
    return (
      <>
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
            pt="2%"
          >
            <Text fontSize="4xl" fontWeight="bold">
              Please Vendor to Continue
            </Text>
            <Box mt="5%">
              <Box display="flex" gap="20px">
                <Input
                  placeholder="First Name"
                  type="text"
                  focusBorderColor="green"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                />
                <Input
                  placeholder="Last Name"
                  type="text"
                  focusBorderColor="green"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                />
              </Box>
              <Box display="flex" gap="20px" mt="4%">
                <Input
                  placeholder="Email"
                  type="email"
                  focusBorderColor="green"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                <Input
                  placeholder="Mobile Number"
                  type="number"
                  focusBorderColor="green"
                  name="number"
                  value={formData.number}
                  onChange={handleChange}
                />
              </Box>
              <Box display="flex" gap="20px" mt="4%">
                <Input
                  placeholder="City"
                  type="text"
                  focusBorderColor="green"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
                <Input
                  placeholder="State"
                  type="text"
                  focusBorderColor="green"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                />
              </Box>
              <Box display="flex" gap="20px" mt="4%">
                <Input
                  placeholder="Country"
                  type="text"
                  focusBorderColor="green"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                />
                <Input
                  placeholder="Pincode"
                  type="number"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  focusBorderColor="green"
                />
              </Box>
              <Box display="flex" gap="20px" mt="4%">
                <Input
                  placeholder="Username"
                  type="text"
                  focusBorderColor="green"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                />
                
              </Box>
              <Box display="flex" gap="20px" mt="4%">
                <Input
                  placeholder="Enter GST No."
                  type="text"
                  name="gstin_no"
                  value={formData.gstin_no}
                  onChange={handleChange}
                  focusBorderColor="green"
                />
              </Box>
              <Box display="flex" gap="20px" mt="4%">
                
                <Input
                  placeholder="Password"
                  type="password"
                  focusBorderColor="green"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <Input
                  placeholder="Confirm Password"
                  type="password"
                  name="confirmpassword"
                  value={formData.confirmpassword}
                  onChange={handleChange}
                  focusBorderColor="green"
                />
              </Box>
              <Box display="flex" mt="2%">
                <Checkbox>I agree to the Terms and Conditions</Checkbox>
              </Box>
              <Button
                width="100%"
                mt="5%"
                colorScheme="green"
                onClick={handleSubmit}
              >
                Signup
              </Button>
            </Box>
            <Box display="flex" gap="5px" justifyContent="center" mt="2%">
              <Text>Already a User?</Text>
              <Link to="/login" color="blue">
                {" "}
                <Text color="blue">Login</Text>{" "}
              </Link>
              <Text>Now!!</Text>
            </Box>
          </Box>
        </Box>
        <Footer />
      </>
    );
  }
  