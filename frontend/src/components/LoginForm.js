import React, { useState } from 'react';
import { Box, FormControl, FormLabel, Input, Button, VStack, Text, Link as ChakraLink, useToast, FormErrorMessage, InputGroup, InputRightElement } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginForm = () => {
  const [identifier, setIdentifier] = useState(''); // Can be email or username
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // isLoading from useAuth is for global auth state, this is for form submission
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const toast = useToast(); // Keep local toast for form-specific or unexpected errors

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
    setErrors({}); // Clear previous form-level errors
    
    const loginResult = await login(identifier, password);
    
    if (loginResult && loginResult.success) {
      // Navigation and success toast are handled by AuthContext's login method
    } else {
      // Error toast is handled by AuthContext, set form error for display
      setErrors({ form: loginResult.error?.detail || 'Invalid credentials or server error.' });
    }
    setIsLoading(false); // Always stop loading after attempt
  };

  return (
    <Box w="100%">
      <form onSubmit={handleSubmit} noValidate>
        <VStack spacing={5} align="stretch">
          {errors.form && (
            <Text color="red.500" textAlign="center" fontSize="sm" role="alert">{errors.form}</Text>
          )}
          <FormControl isInvalid={!!errors.identifier} isRequired>
            <FormLabel htmlFor="identifier">Email or Username</FormLabel>
            <Input 
              id="identifier" 
              name="identifier" 
              type="text" 
              value={identifier} 
              onChange={(e) => setIdentifier(e.target.value)} 
              placeholder="you@example.com or username"
              borderColor={errors.identifier ? 'red.500' : 'inherit'}
              autoComplete="username"
            />
            {errors.identifier && <FormErrorMessage>{errors.identifier}</FormErrorMessage>}
          </FormControl>

          <FormControl isInvalid={!!errors.password} isRequired>
            <FormLabel htmlFor="password">Password</FormLabel>
            <InputGroup>
              <Input 
                id="password" 
                name="password" 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••"
                borderColor={errors.password ? 'red.500' : 'inherit'}
                autoComplete="current-password"
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={() => setShowPassword(!showPassword)} variant="ghost">
                  {showPassword ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
            {errors.password && <FormErrorMessage>{errors.password}</FormErrorMessage>}
          </FormControl>
          
          <Button 
            type="submit" 
            colorScheme="primary"
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
            <ChakraLink as={RouterLink} to="/register" color="primary" fontWeight="500">
              Register
            </ChakraLink>
          </Text>
        </VStack>
      </form>
    </Box>
  );
};

export default LoginForm;
