import React from 'react';
import {
  Box,
  Container,
  Heading,
} from '@chakra-ui/react';
import CreatePostForm from '../components/CreatePostForm';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const CreatePostPage = () => {
  const { user } = useAuth();

  // If user is not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Box as="main" flexGrow={1} py={{ base: '1rem', md: '2rem' }}>
      <Container maxW="container.md" className="container">
        <Heading 
          as="h1" 
          className="page-title" 
          fontFamily="heading" 
          fontSize={{ base: '2rem', md: '2.5rem' }} 
          color="brand.text" 
          mb={{ base: '1.5rem', md: '2rem' }} 
          textAlign="center"
        >
          Create New Blog Post
        </Heading>
        <CreatePostForm />
      </Container>
    </Box>
  );
};

export default CreatePostPage;
