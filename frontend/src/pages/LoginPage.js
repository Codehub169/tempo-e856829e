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
      flexGrow={1} // Ensures the Flex container takes up available vertical space
      py={{ base: '1rem', md: '2rem' }} // Consistent padding with other pages
    >
      <Container maxW="450px">
        <Box
          bg={'white'} // Uses direct color key from theme or default white
          p={{ base: 6, sm: 8, md: 10 }} // Responsive padding
          borderRadius="lg" 
          boxShadow="xl" 
        >
          <Heading
            as="h1"
            fontFamily='heading' // Uses font key from theme
            fontSize={{ base: "xl", md: "2xl" }} // Responsive font size
            color='text' // Uses color key from theme
            textAlign="center"
            mb={{ base: 6, md: 8}} // Responsive margin bottom
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
