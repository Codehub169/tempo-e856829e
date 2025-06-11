import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  Spinner,
  Center,
  VStack,
  Image,
  Link as ChakraLink,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button // For retry or navigation
} from '@chakra-ui/react';
import { format, parseISO, isValid } from 'date-fns';
import apiService from '../services/apiService';

const ViewPostPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchPost = useCallback(async () => {
    if (!postId) return;
    setIsLoading(true);
    // setError(null); // Optional: clear previous error on retry
    try {
      const fetchedPostResponse = await apiService.getPostById(postId);
      setPost(fetchedPostResponse.data);
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to fetch post. It might not exist or an error occurred.';
      setError(errorMessage);
      console.error(`Error fetching post ${postId}:`, err);
      if (err.response?.status === 404) {
        // Optionally, navigate to a custom 404 page or handle differently
      }
    }
    setIsLoading(false);
  }, [postId]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    try {
      const date = parseISO(dateString);
      if (isValid(date)) {
        return format(date, 'MMMM dd, yyyy');
      }
      return dateString; // Fallback for non-ISO or invalid dates
    } catch (e) {
      console.error('Error formatting date:', e);
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <Center minH="calc(100vh - 200px)">
        <Spinner size="xl" color="primary" thickness="4px" />
      </Center>
    );
  }

  if (error) {
    return (
      <Container maxW="container.md" py={{ base: '1rem', md: '2rem' }}>
         <Alert 
            status="error" 
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            minHeight="200px"
            borderRadius="md"
            my={8}
            p={6}
          >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={2} fontSize="xl">
              Error Loading Post
            </AlertTitle>
            <AlertDescription maxWidth="md">
              {error}
            </AlertDescription>
            <Button colorScheme="primary" mt={6} onClick={() => navigate('/')} mr={2}>
              &larr; Back to Blog List
            </Button>
            <Button colorScheme="gray" mt={6} onClick={fetchPost} isLoading={isLoading}>
              Try Again
            </Button>
          </Alert>
      </Container>
    );
  }

  if (!post) {
    // This case might be covered by error handling if API returns 404
    // but good as a fallback if API returns 200 with no data.
    return (
      <Center minH="calc(100vh - 200px)">
        <Text fontSize="xl" color="lightText">Post not found.</Text>
        <Button as={RouterLink} to="/" colorScheme="primary" mt={4}> 
            &larr; Back to Blog List
        </Button>
      </Center>
    );
  }

  return (
    <Box as="main" flexGrow={1} py={{ base: '1rem', md: '2rem' }}>
      <Container maxW="container.md">
        <Box bg="white" p={{ base: '1.5rem', md: '2.5rem' }} borderRadius="8px" boxShadow="0 4px 15px rgba(0,0,0,0.07)">
          <VStack spacing={5} align="stretch">
            <Heading 
              as="h1" 
              fontFamily="heading" 
              fontSize={{ base: '2.2rem', md: '2.8rem' }} 
              fontWeight="700"
              color="text"
              lineHeight="1.3"
            >
              {post.title}
            </Heading>
            <Box fontSize="0.9rem" color="lightText" pb={{base: "0.5rem", md: "1rem"}} mb={{base: "1rem", md: "1.5rem"}}>
              <Text as="span" mr="1rem">
                By <ChakraLink as={RouterLink} to={`/author/${post.owner?.id}`} color="primary" fontWeight="500">{post.owner?.username || 'Unknown Author'}</ChakraLink>
              </Text>
              <Text as="span">
                Published on <Text as="time" dateTime={post.created_at}>
                  {formatDate(post.created_at)}
                </Text>
              </Text>
            </Box>
            <Divider borderColor="border" />
            
            {post.image_url && (
              <Image 
                src={post.image_url} 
                alt={`Featured image for ${post.title}`}
                maxW="100%" 
                h="auto" 
                borderRadius="md" 
                my={{base: "1rem", md: "1.5rem"}} 
                boxShadow="md" 
              />
            )}
 
            <Box className="post-content" fontSize={{ base: '1rem', md: '1.1rem' }} lineHeight="1.8" color="text">
              {post.content.split('\n').filter(p => p.trim() !== '').map((paragraph, index) => (
                <Text key={index} mb="1.5em">
                  {paragraph}
                </Text>
              ))}
            </Box>

            <Button as={RouterLink} to="/" colorScheme="primary" variant="outline" mt={{base: "2rem", md: "2.5rem"}} alignSelf="flex-start">
              &larr; Back to Blog List
            </Button>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};

export default ViewPostPage;
