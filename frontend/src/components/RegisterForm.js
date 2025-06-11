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
  // Heading, // Moved to RegisterPage.js
  Text,
  Link as ChakraLink,
  useToast,
  InputGroup,
  InputRightElement
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom'; // useNavigate removed as it's handled by AuthContext
import { useAuth } from '../contexts/AuthContext';

const RegisterForm = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    watch,
    setError: setFormError, // react-hook-form's setError
  } = useForm();
  const auth = useAuth();
  const toast = useToast();
  const [apiError, setApiError] = useState(''); // For general API errors not tied to fields
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const password = watch('password');

  const onSubmit = async (values) => {
    setApiError(''); // Clear previous general API errors
    try {
      const response = await auth.register(values.username, values.email, values.password);
      
      if (response && response.success) {
        // Toast and navigation are handled by AuthContext's register method on success
      } else {
        // Handle errors returned from auth.register
        const errorDetail = response.error?.detail;
        let toastMessage = 'Registration failed. Please try again.';

        if (typeof errorDetail === 'string') {
          toastMessage = errorDetail;
          // Check for common field-specific errors from backend
          if (errorDetail.toLowerCase().includes('email already registered')) {
            setFormError('email', { type: 'server', message: errorDetail });
          } else if (errorDetail.toLowerCase().includes('username already taken')) {
            setFormError('username', { type: 'server', message: errorDetail });
          } else {
            setApiError(toastMessage); // Display as a general form error
          }
        } else if (Array.isArray(errorDetail)) { // FastAPI validation errors
          let unmappedErrors = [];
          errorDetail.forEach(err => {
            if(err.loc && err.loc.length > 1 && typeof err.loc[1] === 'string'){
                const fieldName = err.loc[1];
                setFormError(fieldName, { type: 'server', message: err.msg });
            } else {
                 unmappedErrors.push(err.msg);
            }
          });
          if (unmappedErrors.length > 0) {
            setApiError(unmappedErrors.join('; '));
          }
          toastMessage = 'Please check the form for errors.'; // General toast if specific errors are on fields
        } else if (response.error) { // Fallback for other error structures
            setApiError(response.error.message || toastMessage);
        }

        toast({
          title: 'Registration Failed',
          description: apiError || toastMessage, // Show specific API error or general one
          status: 'error',
          duration: 7000,
          isClosable: true,
          position: 'top-right',
        });
      }
    } catch (error) {
      // This catch is for unexpected errors during the auth.register call itself
      const unexpectedErrorMessage = 'An unexpected error occurred during registration.';
      setApiError(unexpectedErrorMessage);
      toast({
        title: 'Registration Error',
        description: unexpectedErrorMessage,
        status: 'error',
        duration: 7000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  return (
    <Box w="100%">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <VStack spacing={5} align="stretch">
          <FormControl isInvalid={!!errors.username} isRequired>
            <FormLabel htmlFor="username" fontWeight="600" color="text">Username</FormLabel>
            <Input
              id="username"
              placeholder="Choose a unique username"
              {...register('username', {
                required: 'Username is required',
                minLength: { value: 3, message: 'Username must be at least 3 characters' },
                maxLength: { value: 50, message: 'Username must be at most 50 characters' },
              })}
              borderColor={errors.username ? 'red.500' : 'inherit'}
              autoComplete="username"
            />
            <FormErrorMessage>{errors.username && errors.username.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.email} isRequired>
            <FormLabel htmlFor="email" fontWeight="600" color="text">Email Address</FormLabel>
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
              borderColor={errors.email ? 'red.500' : 'inherit'}
              autoComplete="email"
            />
            <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.password} isRequired>
            <FormLabel htmlFor="password" fontWeight="600" color="text">Password</FormLabel>
            <InputGroup>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Choose a strong password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Password must be at least 8 characters' },
                })}
                borderColor={errors.password ? 'red.500' : 'inherit'}
                autoComplete="new-password"
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={() => setShowPassword(!showPassword)} variant="ghost">
                  {showPassword ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>{errors.password && errors.password.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.confirmPassword} isRequired>
            <FormLabel htmlFor="confirmPassword" fontWeight="600" color="text">Confirm Password</FormLabel>
            <InputGroup>
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Re-enter your password"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) =>
                    value === password || 'Passwords do not match',
                })}
                borderColor={errors.confirmPassword ? 'red.500' : 'inherit'}
                autoComplete="new-password"
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={() => setShowConfirmPassword(!showConfirmPassword)} variant="ghost">
                  {showConfirmPassword ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>{errors.confirmPassword && errors.confirmPassword.message}</FormErrorMessage>
          </FormControl>
          
          {apiError && (
            <Text color="red.500" textAlign="center" fontSize="sm" role="alert">
              {apiError}
            </Text>
          )}

          <Button
            type="submit"
            isLoading={isSubmitting}
            colorScheme="primary"
            w="100%"
            mt={2}
            size="lg"
            fontSize="md"
          >
            Register
          </Button>

          <Text textAlign="center" fontSize="sm" mt={3}>
            Already have an account?{' '}
            <ChakraLink as={RouterLink} to="/login" color="primary" fontWeight="500">
              Login
            </ChakraLink>
          </Text>
        </VStack>
      </form>
    </Box>
  );
};

export default RegisterForm;
