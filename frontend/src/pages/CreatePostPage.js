import React from 'react';
import {
  Box,
  Container,
  // Heading, // Heading is now part of CreatePostForm
} from '@chakra-ui/react';
import CreatePostForm from '../components/CreatePostForm';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const CreatePostPage = () => {
  const { user, isLoading } = useAuth(); // Use isLoading from useAuth to prevent premature redirect

  // If auth state is still loading, don't render anything yet or show a loader
  if (isLoading) {
    // Optionally return a loading spinner specific to page auth check
    // For now, returning null to wait for auth check completion from AuthProvider
    return null; 
  }

  // If not loading and no user, then redirect
  if (!user) {
    return <Navigate to="/login" state={{ from: '/create-post' }} replace />;
  }

  return (
    <Box as="main" flexGrow={1} py={{ base: '1rem', md: '2rem' }}>
      <Container maxW="container.md">
        {/* 
          Heading has been moved to CreatePostForm.js for better component encapsulation.
          If it were to be kept here, it would look like:
          <Heading 
            as="h1" 
            fontFamily="heading" 
            fontSize={{ base: '2rem', md: '2.5rem' }} 
            color="text" 
            mb={{ base: '1.5rem', md: '2rem' }} 
            textAlign="center"
          >
            Create New Blog Post
          </Heading> 
        */}
        <CreatePostForm />
      </Container>
    </Box>
  );
};

export default CreatePostPage;
