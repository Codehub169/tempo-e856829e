import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
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
  AlertDescription
} from '@chakra-ui/react';
import { format } from 'date-fns';
import apiService from '../services/apiService';

const ViewPostPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedPost = await apiService.getPostById(postId);
        setPost(fetchedPost);
      } catch (err) {
        setError(err.response?.data?.detail || err.message || 'Failed to fetch post. It might not exist or an error occurred.');
        console.error(`Error fetching post ${postId}:`, err);
      }
      setIsLoading(false);
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  if (isLoading) {
    return (
      <Center minH="calc(100vh - 200px)"> {/* Adjust height based on header/footer */}
        <Spinner size="xl" color="brand.primary" thickness="4px" />
      </Center>
    );
  }

  if (error) {
    return (
      <Container maxW="container.md" py={{ base: '1rem', md: '2rem' }} textAlign="center">
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
            <ChakraLink as={RouterLink} to="/" color="brand.primary" fontWeight="500" mt={6} _hover={{ textDecoration: 'underline' }}>
              &larr; Back to Blog List
            </ChakraLink>
          </Alert>
      </Container>
    );
  }

  if (!post) {
    return (
      <Center minH="calc(100vh - 200px)">
        <Text fontSize="xl" color="brand.lightText">Post not found.</Text>
      </Center>
    );
  }

  return (
    <Box as="main" flexGrow={1} py={{ base: '1rem', md: '2rem' }}>
      <Container maxW="container.md" className="container">
        <Box className="blog-post-container" bg="white" p={{ base: '1.5rem', md: '2.5rem' }} borderRadius="8px" boxShadow="0 4px 15px rgba(0,0,0,0.07)">
          <VStack spacing={4} align="stretch">
            <Heading 
              as="h1" 
              className="post-title" 
              fontFamily="heading" 
              fontSize={{ base: '2.2rem', md: '2.8rem' }} 
              fontWeight="700"
              color="brand.text" 
              lineHeight="1.3"
            >
              {post.title}
            </Heading>
            <Box className="post-meta" fontSize="0.9rem" color="brand.lightText" pb="1rem" mb="1.5rem">
              <Text as="span" mr="1rem">
                By <Text as="strong">{post.owner?.username || 'Unknown Author'}</Text>
              </Text>
              <Text as="span">
                Published on <Text as="time" dateTime={post.created_at}>
                  {format(new Date(post.created_at), 'MMMM dd, yyyy')}
                </Text>
              </Text>
            </Box>
            <Divider borderColor="brand.border" />
            
            {post.image_url && (
              <Image 
                src={post.image_url} 
                alt={post.title} 
                maxW="100%" 
                h="auto" 
                borderRadius="4px" 
                my="1.5rem" 
                boxShadow="0 2px 8px rgba(0,0,0,0.1)" 
              />
            )}

            {/* This is a simplified content rendering. For actual HTML content, you'd use dangerouslySetInnerHTML or a markdown parser */} 
            <Box className="post-content" fontSize={{ base: '1rem', md: '1.1rem' }} lineHeight="1.7" color="brand.text">
              {post.content.split('\n').map((paragraph, index) => (
                <Text key={index} mb="1.5em">
                  {paragraph}
                </Text>
              ))}
            </Box>

            <ChakraLink as={RouterLink} to="/" className="back-link" display="inline-block" mt="2.5rem" color="brand.primary" fontWeight="500" _hover={{ textDecoration: 'underline' }}>
              &larr; Back to Blog List
            </ChakraLink>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};

export default ViewPostPage;
