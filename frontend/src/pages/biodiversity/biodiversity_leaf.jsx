import React, { useState } from "react";
import {
  Box,
  Button,
  Text,
  Image,
  Divider,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";
import { IoCloudUploadOutline } from "react-icons/io5";
import axios from "axios";

export default function BiodiversityLeaf() {
  const [selectedImage, setSelectedImage] = useState(null); // To store the selected image
  const [apiResponse, setApiResponse] = useState(null); // To store the API response
  const [isLoading, setIsLoading] = useState(false);
  // Handle file input change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file)); // Generate a preview URL
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!selectedImage) {
      alert("Please upload an image first.");
      return;
    }

    const formData = new FormData();
    const fileInput = document.getElementById("dropzone-file");
    if (fileInput.files[0]) {
      formData.append("image", fileInput.files[0]);
      setIsLoading(true);
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/get-leaf-species/",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setApiResponse(response.data); // Store API response
        setIsLoading(false);
      } catch (error) {
        console.error("Error uploading file:", error);
        setIsLoading(false);
        alert("Failed to upload the image. Please try again.");
      }
    }
  };

  // Recursive function to render nested data
  const renderData = (data) => {
    if (typeof data === "string") {
      return <Text mb="2">{data.replace("*","").replace(":*",":")}</Text>;
    }

    if (Array.isArray(data)) {
      return (
        <UnorderedList pl="5">
          {data.map((item, index) => (
            <ListItem key={index}>{renderData(item)}</ListItem>
          ))}
        </UnorderedList>
      );
    }

    if (typeof data === "object") {
      return Object.entries(data).map(([key, value], index) => (
        <Box key={index} mb="4">
          <Text fontWeight="bold" mt="2">
            {key}
          </Text>
          <Divider mb="2" />
          {renderData(value)}
        </Box>
      ));
    }

    return null;
  };

  return (
    <>
      <Box px="20%" mt="10%">
        {/* <Text fontSize="2xl" fontWeight="bold" mt="5%" mb="2%">
          Gain Knowledge By just uploading any species picture
        </Text> */}
        <Box display="flex" justifyContent="center" flexDirection="column" mb="5%">
          <div className="flex items-center justify-center w-full pb-[5%]">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col pb-[5%] pt-[3%] items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <IoCloudUploadOutline fontSize="200px" />
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  SVG, PNG, JPG or GIF (MAX. 800x400px)
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>

          {/* Display the selected image */}
          {selectedImage && (
            <Box mb="5%" display="flex" justifyContent="center" flexDirection="column">
              <Text mb="2%" fontWeight="bold" textAlign="center">Selected Image:</Text>
              <Box display="flex" justifyContent="center">
              <Image src={selectedImage} alt="Selected species"  maxH="300px" maxW="300px"/>
              </Box>
            </Box>
          )}

          <Button colorScheme="green" onClick={handleSubmit} isLoading={isLoading}>
            Submit
          </Button>

          {/* Display the API response */}
          {apiResponse && (
            <Box
              mt="5%"
              textAlign="left"
              p="4"
              border="1px"
              borderRadius="md"
              borderColor="gray.300"
            >
              <Text fontSize="xl" fontWeight="bold" mb="3">
                Leaf Information
              </Text>
              {renderData(apiResponse)}
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
}
