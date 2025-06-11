import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  VStack,
  Heading,
  Text,
  Link as ChakraLink,
  useToast,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RegisterForm = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    watch,
  } = useForm();
  const auth = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [serverError, setServerError] = useState('');

  const password = watch('password');

  const onSubmit = async (values) => {
    setServerError('');
    try {
      const response = await auth.register(values.username, values.email, values.password);
      if (response && response.id) {
        toast({
          title: 'Registration Successful',
          description: 'Your account has been created. Please login.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        navigate('/login');
      } else {
        // This case might occur if auth.register doesn't throw an error but also doesn't return expected user data
        setServerError(response?.detail || 'Registration failed. Please try again.');
        toast({
          title: 'Registration Failed',
          description: response?.detail || 'An unexpected error occurred.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.detail || error.message || 'An unexpected error occurred.';
      setServerError(errorMessage);
      toast({
        title: 'Registration Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box className="form-container" bg="white" p={{ base: '1.5rem', md: '2.5rem' }} borderRadius="8px" boxShadow="0 4px 20px rgba(0,0,0,0.1)" w="100%">
      <Heading as="h1" className="page-title" fontSize={{ base: '1.8rem', md: '2.2rem' }} fontFamily="heading" color="brand.text" mb="2rem" textAlign="center">
        Create Your Account
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <VStack spacing={5}>
          <FormControl isInvalid={errors.username || serverError?.toLowerCase().includes('username')}>
            <FormLabel htmlFor="username" fontWeight="600" color="brand.text">Username</FormLabel>
            <Input
              id="username"
              placeholder="Choose a unique username"
              {...register('username', {
                required: 'Username is required',
                minLength: { value: 3, message: 'Username must be at least 3 characters' },
              })}
              className="form-control"
              borderColor={errors.username || serverError?.toLowerCase().includes('username') ? 'brand.error' : 'brand.border'}
            />
            <FormErrorMessage>{errors.username && errors.username.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.email || serverError?.toLowerCase().includes('email')}>
            <FormLabel htmlFor="email" fontWeight="600" color="brand.text">Email Address</FormLabel>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Invalid email address',
                },
              })}
              className="form-control"
              borderColor={errors.email || serverError?.toLowerCase().includes('email') ? 'brand.error' : 'brand.border'}
            />
            <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.password}>
            <FormLabel htmlFor="password" fontWeight="600" color="brand.text">Password</FormLabel>
            <Input
              id="password"
              type="password"
              placeholder="Choose a strong password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Password must be at least 8 characters' },
              })}
              className="form-control"
              borderColor={errors.password ? 'brand.error' : 'brand.border'}
            />
            <FormErrorMessage>{errors.password && errors.password.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.confirmPassword}>
            <FormLabel htmlFor="confirmPassword" fontWeight="600" color="brand.text">Confirm Password</FormLabel>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) =>
                  value === password || 'Passwords do not match',
              })}
              className="form-control"
              borderColor={errors.confirmPassword ? 'brand.error' : 'brand.border'}
            />
            <FormErrorMessage>{errors.confirmPassword && errors.confirmPassword.message}</FormErrorMessage>
          </FormControl>
          
          {serverError && (
            <Text color="brand.error" textAlign="center" fontSize="sm">
              {serverError.split('\n').map((line, idx) => (
                <React.Fragment key={idx}>{line}<br /></React.Fragment>
              ))}
            </Text>
          )}

          <Button
            type="submit"
            isLoading={isSubmitting}
            className="btn btn-primary"
            w="100%"
            mt={2}
          >
            Register
          </Button>

          <ChakraLink as={RouterLink} to="/login" className="form-link" color="brand.primary" display="block" textAlign="center" mt="1.5rem" fontSize="0.9rem">
            Already have an account? Login
          </ChakraLink>
        </VStack>
      </form>
    </Box>
  );
};

export default RegisterForm;
