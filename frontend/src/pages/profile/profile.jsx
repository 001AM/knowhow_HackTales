import { Box, Button, Image, Input, Text, useToast } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axios/axiosInstance";

export default function Profile() {
  const navigate = useNavigate();
  const toast = useToast();
  const [isEditing, setIsEditing] = React.useState(false);
  const [formData, setFormData] = React.useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    country: "",
    city: "",
    pincode: "",
    phone_number: "",
  });

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get("/get_profile/");
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          status: "error",
          duration: 3000,
        });
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await axiosInstance.post("/update_profile/", formData);
      toast({
        title: "Success",
        description: "Profile updated successfully",
        status: "success",
        duration: 3000,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        status: "error",
        duration: 3000,
      });
    }
  };

  return (
    <Box maxWidth="1200px" margin="0 auto" padding="40px" marginTop="5rem">
      <Box
        display="flex"
        flexDirection={{ base: "column", md: "row" }}
        gap="40px"
      >
        <Box
          flex={{ base: "1", md: "0 0 300px" }}
          display="flex"
          justifyContent="center"
        >
          <Image
            src="/profile-placeholder.png"
            alt="profile"
            borderRadius="full"
            boxSize={{ base: "150px", md: "200px" }}
            objectFit="cover"
          />
        </Box>
        <Box flex="1">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb="30px"
          >
            <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold">
              Profile Details
            </Text>
            <Button
              colorScheme={isEditing ? "green" : "blue"}
              onClick={() => (isEditing ? handleSubmit() : setIsEditing(true))}
              size={{ base: "sm", md: "md" }}
            >
              {isEditing ? "Save Changes" : "Edit Profile"}
            </Button>
          </Box>
          <Box display="flex" flexDirection="column" gap="24px">
            <Box
              display="flex"
              flexDirection={{ base: "column", md: "row" }}
              gap="20px"
            >
              <Box flex="1">
                <Text mb="2">First Name</Text>
                <Input
                  placeholder="First Name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  isDisabled={!isEditing}
                  size="md"
                />
              </Box>
              <Box flex="1">
                <Text mb="2">Last Name</Text>
                <Input
                  placeholder="Last Name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  isDisabled={!isEditing}
                  size="md"
                />
              </Box>
            </Box>
            <Box
              display="flex"
              flexDirection={{ base: "column", md: "row" }}
              gap="20px"
            >
              <Box flex="1">
                <Text mb="2">Email</Text>
                <Input
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  isDisabled={!isEditing}
                  size="md"
                />
              </Box>
              <Box flex="1">
                <Text mb="2">Phone Number</Text>
                <Input
                  placeholder="Phone Number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  isDisabled={!isEditing}
                  size="md"
                />
              </Box>
            </Box>
            <Box
              display="flex"
              flexDirection={{ base: "column", md: "row" }}
              gap="20px"
            >
              <Box flex="1">
                <Text mb="2">City</Text>
                <Input
                  placeholder="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  isDisabled={!isEditing}
                  size="md"
                />
              </Box>
              <Box flex="1">
                <Text mb="2">Country</Text>
                <Input
                  placeholder="Country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  isDisabled={!isEditing}
                  size="md"
                />
              </Box>
            </Box>
            <Box
              display="flex"
              flexDirection={{ base: "column", md: "row" }}
              gap="20px"
            >
              <Box flex="1">
                <Text mb="2">Pincode</Text>
                <Input
                  placeholder="Pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  isDisabled={!isEditing}
                  size="md"
                />
              </Box>
              <Box flex="1">
                <Text mb="2">Username</Text>
                <Input
                  placeholder="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  isDisabled={true}
                  size="md"
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
