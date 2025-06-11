import React, { useState } from 'react';
import { Box, FormControl, FormLabel, Input, Textarea, Button, VStack, Heading, useToast, FormErrorMessage, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';

const CreatePostForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const toast = useToast();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required.';
    else if (title.trim().length < 3) newErrors.title = 'Title must be at least 3 characters.';
    else if (title.trim().length > 200) newErrors.title = 'Title must be at most 200 characters.';
    
    if (!content.trim()) newErrors.content = 'Content is required.';
    else if (content.trim().length < 10) newErrors.content = 'Content must be at least 10 characters.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({}); // Clear previous errors
    try {
      const postData = { title, content };
      const newPostResponse = await apiService.createPost(postData);
      toast({
        title: 'Post created.',
        description: "Your new blog post has been published successfully!",
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      navigate(`/post/${newPostResponse.data.id}`); 
    } catch (error) {
      const apiErrors = error.response?.data?.detail;
      let errorMessage = 'Failed to create post. Please try again.';

      if (Array.isArray(apiErrors)) { // FastAPI validation errors
        const fieldErrors = {};
        apiErrors.forEach(err => {
          if(err.loc && err.loc.length > 1 && typeof err.loc[1] === 'string'){
            fieldErrors[err.loc[1]] = err.msg;
          } else {
            errorMessage = err.msg; // General error if not field specific
          }
        });
        setErrors(fieldErrors);
        if(Object.keys(fieldErrors).length > 0) errorMessage = "Please check the form for errors.";
      } else if (typeof apiErrors === 'string') {
        errorMessage = apiErrors;
      }

      toast({
        title: 'Error Creating Post',
        description: errorMessage,
        status: 'error',
        duration: 7000,
        isClosable: true,
        position: 'top-right',
      });
      setIsLoading(false);
    }
    // setIsLoading(false) should be here if navigate happens, 
    // but since navigate unmounts, it's okay. If it didn't unmount, it'd be needed.
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
      <Heading as="h1" fontFamily="heading" fontSize={{base: "2xl", md: "3xl"}} color="text" mb={8} textAlign="center">
        Create New Blog Post
      </Heading>
      <form onSubmit={handleSubmit} noValidate>
        <VStack spacing={6} align="stretch">
          <FormControl isInvalid={!!errors.title} isRequired>
            <FormLabel htmlFor="postTitle" fontWeight="600">Post Title</FormLabel>
            <Input 
              id="postTitle" 
              name="postTitle" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Enter an engaging title" 
              borderColor={errors.title ? 'red.500' : 'inherit'}
              maxLength={200}
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
              borderColor={errors.content ? 'red.500' : 'inherit'}
            />
            {errors.content && <FormErrorMessage>{errors.content}</FormErrorMessage>}
          </FormControl>
          
          {errors.form && (
            <Text color="red.500" textAlign="center" fontSize="sm">{errors.form}</Text>
          )}

          <Button 
            type="submit" 
            colorScheme="accent"
            isLoading={isLoading} 
            loadingText="Publishing..."
            size="lg"
            fontSize="md"
            w="full"
          >
            Publish Post
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default CreatePostForm;
