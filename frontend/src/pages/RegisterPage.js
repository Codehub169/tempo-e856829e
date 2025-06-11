import React from 'react';
import {
  Box,
  Container,
  Heading,
  Flex,
} from '@chakra-ui/react';
import RegisterForm from '../components/RegisterForm';

const RegisterPage = () => {
  return (
    <Flex
      align="center"
      justify="center"
      width="100%"
      flexGrow={1} // Ensures the Flex container takes up available vertical space
      py={{ base: '1rem', md: '2rem' }} // Consistent padding with other pages
    >
      <Container maxW="480px"> {/* Max width slightly larger for register form potentially */}
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
            Create Your Account
          </Heading>
          <RegisterForm />
        </Box>
      </Container>
    </Flex>
  );
};

export default RegisterPage;
