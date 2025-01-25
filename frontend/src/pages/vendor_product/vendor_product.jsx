import React, { useState, useEffect, useRef } from "react";
import { MdDelete } from "react-icons/md";
import { FiEdit3 } from "react-icons/fi";
import { FaPlus } from "react-icons/fa";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Image,
  useToast,
  Textarea,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";

import axiosInstance from "../../axios/axiosInstance";
import Context from "../../context/context";
import { useNavigate } from "react-router-dom";
export default function VendorProduct() {
  const { isLogin, setLogin, setVendor, vendor } = React.useContext(Context);
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const toast = useToast();

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();
  const cancelRef = useRef();
  const [productToDelete, setProductToDelete] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price_in_points: "",
    stock: "",
    description: "",
    image: null,
  });
  useEffect(() => {
    console.log(vendor);
    if (!vendor) {
      navigate("/");
    }
  }, [vendor, navigate]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/products", {
          vendor_product: true,
        });
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setImageFile(null);
    onOpen();
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    onDeleteOpen();
  };

  const handleInputChange = (field, value, isNew = false) => {
    if (isNew) {
      setNewProduct((prev) => ({ ...prev, [field]: value }));
    } else {
      setSelectedProduct((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleFileChange = (event, isNew = false) => {
    const file = event.target.files[0];
    if (isNew) {
      setNewProduct((prev) => ({ ...prev, image: file }));
    } else {
      setImageFile(file);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await axiosInstance.delete(`/products/${productToDelete.id}/`);
      setProducts((prev) =>
        prev.filter((product) => product.id !== productToDelete.id),
      );

      toast({
        title: "Product deleted.",
        description: "The product has been successfully deleted.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      onDeleteClose();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error.",
        description: "Failed to delete the product. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleAddProduct = async () => {
    try {
      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("price_in_points", newProduct.price_in_points);
      formData.append("stock", newProduct.stock);
      formData.append("description", newProduct.description);
      if (newProduct.image) {
        formData.append("image", newProduct.image);
      }

      const response = await axiosInstance.post("/products/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setProducts((prev) => [...prev, response.data]);
      toast({
        title: "Product added.",
        description: "The new product has been successfully added.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      onAddClose();
      setNewProduct({
        name: "",
        price_in_points: "",
        stock: "",
        description: "",
        image: null,
      });
    } catch (error) {
      console.error("Error adding product:", error);
      toast({
        title: "Error.",
        description: "Failed to add the product. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("name", selectedProduct.name);
      formData.append("price_in_points", selectedProduct.price_in_points);
      formData.append("stock", selectedProduct.stock);
      formData.append("description", selectedProduct.description);
      if (imageFile) {
        formData.append("image", imageFile); // Include the image file if present
      }

      const response = await axiosInstance.put(
        `/products/${selectedProduct.id}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      toast({
        title: "Product updated.",
        description: "The product details have been successfully updated.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setProducts((prev) =>
        prev.map((product) =>
          product.id === selectedProduct.id ? response.data : product,
        ),
      );

      onClose();
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        title: "Error.",
        description: "Failed to update the product. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  return (
    <Box mt="10%" px="15%" mb="5%">
      <Box display="flex" justifyContent="end" mb="2%">
        <Button onClick={onAddOpen} gap="10px" colorScheme="green">
          Add Product <FaPlus />
        </Button>
      </Box>
      <TableContainer>
        <Table variant="striped" colorScheme="gray">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Price (₹)</Th>
              <Th>Stock</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {products.map((product, index) => (
              <Tr key={index}>
                <Td>{product.name}</Td>
                <Td>{product.price_in_points}</Td>
                <Td>{product.stock}</Td>
                <Td>
                  <Box>
                    <Button
                      onClick={() => handleEditClick(product)}
                      variant="ghost"
                    >
                      <FiEdit3 />
                    </Button>
                    <Button
                      onClick={() => handleDeleteClick(product)}
                      variant="ghost"
                    >
                      <MdDelete />
                    </Button>
                  </Box>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <Modal isOpen={isAddOpen} onClose={onAddClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Product</ModalHeader>
          <ModalBody>
            <Input
              type="text"
              value={newProduct.name}
              onChange={(e) => handleInputChange("name", e.target.value, true)}
              placeholder="Product Name"
              mb={4}
            />
            <Input
              type="number"
              value={newProduct.price_in_points}
              onChange={(e) =>
                handleInputChange("price_in_points", e.target.value, true)
              }
              placeholder="Price in ₹"
              mb={4}
            />
            <Input
              type="number"
              value={newProduct.stock}
              onChange={(e) => handleInputChange("stock", e.target.value, true)}
              placeholder="Stock"
              mb={4}
            />
            <Textarea
              value={newProduct.description}
              onChange={(e) =>
                handleInputChange("description", e.target.value, true)
              }
              placeholder="Description"
              mb={4}
            />
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, true)}
              mb={4}
            />
          </ModalBody>
          <ModalFooter>
            <Button onClick={onAddClose} mr={3}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleAddProduct}>
              Add Product
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Edit Product</DrawerHeader>
          <DrawerBody>
            {selectedProduct && (
              <>
                {selectedProduct.image && (
                  <Box mb={4}>
                    <Image
                      src={`http://127.0.0.1:8000/${selectedProduct.image}`}
                      alt="Product"
                      borderRadius="md"
                      mb={2}
                    />
                  </Box>
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e)}
                  mb={4}
                />
                <Input
                  type="text"
                  value={selectedProduct.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Product Name"
                  mb={4}
                />
                <Input
                  type="number"
                  value={selectedProduct.price_in_points}
                  onChange={(e) =>
                    handleInputChange("price_in_points", e.target.value)
                  }
                  placeholder="Price in ₹"
                  mb={4}
                />
                <Input
                  type="number"
                  value={selectedProduct.stock}
                  onChange={(e) => handleInputChange("stock", e.target.value)}
                  placeholder="Stock"
                  mb={4}
                />
                <Textarea
                  value={selectedProduct.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Description"
                  mb={4}
                />
                <Button
                  colorScheme="blue"
                  onClick={handleSubmit}
                  mt={4}
                  width="100%"
                >
                  Save Changes
                </Button>
              </>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Product
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this product? This action cannot
              be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteConfirm} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
