import React, { useState } from 'react';
import { Box, FormControl, FormLabel, Input, Button, VStack, Heading, Text, Link as ChakraLink, useToast, FormErrorMessage } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginForm = () => {
  const [identifier, setIdentifier] = useState(''); // Can be email or username
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const validateForm = () => {
    const newErrors = {};
    if (!identifier.trim()) newErrors.identifier = 'Email or Username is required.';
    if (!password) newErrors.password = 'Password is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await login(identifier, password);
      toast({
        title: 'Login Successful',
        description: "Welcome back!",
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/'); // Redirect to homepage or dashboard after login
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Invalid credentials or server error. Please try again.';
      setErrors({ form: errorMessage });
      toast({
        title: 'Login Failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setIsLoading(false);
    }
  };

  return (
    <Box 
      bg="white" 
      p={{ base: 6, md: 10 }}
      borderRadius="md" 
      boxShadow="xl" 
      maxW="450px" 
      w="100%"
    >
      <Heading as="h1" fontFamily="heading" fontSize={{base: "xl", md: "2xl"}} color="brand.text" mb={8} textAlign="center">
        Login to Your Account
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={5} align="stretch">
          {errors.form && (
            <Text color="red.500" textAlign="center" fontSize="sm">{errors.form}</Text>
          )}
          <FormControl isInvalid={!!errors.identifier} isRequired>
            <FormLabel htmlFor="identifier">Email or Username</FormLabel>
            <Input 
              id="identifier" 
              name="identifier" 
              type="text" // Changed from email to text to allow username
              value={identifier} 
              onChange={(e) => setIdentifier(e.target.value)} 
              placeholder="you@example.com or username"
            />
            {errors.identifier && <FormErrorMessage>{errors.identifier}</FormErrorMessage>}
          </FormControl>

          <FormControl isInvalid={!!errors.password} isRequired>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input 
              id="password" 
              name="password" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••"
            />
            {errors.password && <FormErrorMessage>{errors.password}</FormErrorMessage>}
          </FormControl>
          
          <Button 
            type="submit" 
            colorScheme="brandPrimary" // Mapped from --primary-color
            isLoading={isLoading} 
            loadingText="Logging in..."
            w="100%"
            size="lg"
            fontSize="md"
          >
            Login
          </Button>

          <Text textAlign="center" fontSize="sm">
            Don't have an account?{' '}
            <ChakraLink as={RouterLink} to="/register" color="brand.primary" fontWeight="500">
              Register
            </ChakraLink>
          </Text>
        </VStack>
      </form>
    </Box>
  );
};

export default LoginForm;
