import React, { useState } from 'react';
import { Box, FormControl, FormLabel, Input, Textarea, Button, VStack, Heading, useToast, FormErrorMessage } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/apiService';

const CreatePostForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const toast = useToast();
  const navigate = useNavigate();
  const { token } = useAuth(); // Assuming token is needed for apiService

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required.';
    if (title.trim().length < 3) newErrors.title = 'Title must be at least 3 characters.';
    if (!content.trim()) newErrors.content = 'Content is required.';
    if (content.trim().length < 10) newErrors.content = 'Content must be at least 10 characters.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const postData = { title, content };
      // Assuming apiService.createPost takes token implicitly or explicitly
      const newPost = await apiService.createPost(postData, token);
      toast({
        title: 'Post created.',
        description: "Your new blog post has been published successfully!",
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate(`/post/${newPost.id}`); // Navigate to the newly created post
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Failed to create post. Please try again.';
      toast({
        title: 'Error creating post.',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      if (error.response?.data?.errors) {
        setErrors(prev => ({...prev, ...error.response.data.errors}));
      }
      setIsLoading(false);
    }
  };

  return (
    <Box 
      bg="white" 
      p={{ base: 6, md: 10 }}
      borderRadius="md" 
      boxShadow="lg" 
      maxW="800px" 
      mx="auto"
    >
      <Heading as="h1" fontFamily="heading" fontSize={{base: "2xl", md: "3xl"}} color="brand.text" mb={8} textAlign="center">
        Create New Blog Post
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={6} align="stretch">
          <FormControl isInvalid={!!errors.title} isRequired>
            <FormLabel htmlFor="postTitle" fontWeight="600">Post Title</FormLabel>
            <Input 
              id="postTitle" 
              name="postTitle" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Enter an engaging title" 
            />
            {errors.title && <FormErrorMessage>{errors.title}</FormErrorMessage>}
          </FormControl>

          <FormControl isInvalid={!!errors.content} isRequired>
            <FormLabel htmlFor="postContent" fontWeight="600">Content</FormLabel>
            <Textarea 
              id="postContent" 
              name="postContent" 
              value={content} 
              onChange={(e) => setContent(e.target.value)} 
              placeholder="Write your amazing blog post here..."
              rows={10}
              minH="250px"
            />
            {errors.content && <FormErrorMessage>{errors.content}</FormErrorMessage>}
          </FormControl>
          
          <Button 
            type="submit" 
            colorScheme="brandAccent" // Mapped from --accent-color
            isLoading={isLoading} 
            loadingText="Publishing..."
            size="lg"
            fontSize="md"
          >
            Publish Post
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default CreatePostForm;
