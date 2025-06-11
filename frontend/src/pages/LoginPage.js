import React from 'react';
import {
  Box,
  Container,
  Heading,
  Flex,
} from '@chakra-ui/react';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
  return (
    <Flex
      align="center"
      justify="center"
      width="100%"
      // py={10} // App.js <Box as="main"> already has py={8}
      flexGrow={1} // Ensure it takes up space if content is short
    >
      <Container maxW="450px" >
        <Box
          bg={'white'} 
          p={{ base: 6, sm: 8, md: 10 }} // Responsive padding
          borderRadius="lg" // theme.radii.lg
          boxShadow="xl" // theme.shadows.xl
        >
          <Heading
            as="h1"
            fontFamily='heading' // From theme: Lora
            fontSize={{ base: "xl", md: "2xl" }} // Matches 'page-title' style from login.html
            color='brand.text' // From theme
            textAlign="center"
            mb={{ base: 6, md: 8}} // Responsive margin
          >
            Login to Your Account
          </Heading>
          <LoginForm />
        </Box>
      </Container>
    </Flex>
  );
};

export default LoginPage;
