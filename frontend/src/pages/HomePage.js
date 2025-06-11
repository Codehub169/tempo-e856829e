import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Text,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button // For potential pagination or reload
} from '@chakra-ui/react';
import BlogPostCard from '../components/BlogPostCard';
import apiService from '../services/apiService';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [page, setPage] = useState(1); // For pagination if implemented
  // const [hasMore, setHasMore] = useState(true); // For pagination

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    // setError(null); // Keep previous error visible while retrying, or clear it:
    // setError(null); 
    try {
      // const fetchedPostsResponse = await apiService.getPosts(page, 20); // Example with pagination
      const fetchedPostsResponse = await apiService.getPosts();
      setPosts(fetchedPostsResponse.data || []); 
      // setHasMore(fetchedPostsResponse.data && fetchedPostsResponse.data.length > 0); // Pagination logic
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to fetch posts. Please try again later.';
      setError(errorMessage);
      console.error('Error fetching posts:', err);
    }
    setIsLoading(false);
  }, []); // Add 'page' to dependency array if pagination is used

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <Box as="main" flexGrow={1} py={{ base: '1rem', md: '2rem' }}>
      <Container maxW="container.xl">
        <Heading 
          as="h1" 
          fontFamily="heading" 
          fontSize={{ base: '2rem', md: '2.5rem' }} 
          color="text"
          mb={{ base: '1.5rem', md: '2rem' }} 
          textAlign="center"
        >
          Latest Posts
        </Heading>

        {isLoading && posts.length === 0 && (
          <Center minH="300px">
            <Spinner size="xl" color="primary" thickness="4px" />
          </Center>
        )}

        {error && !isLoading && (
           <Alert 
            status="error" 
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            minHeight="200px" // Use minHeight for flexibility
            borderRadius="md"
            p={6}
            my={8}
          >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              Error Fetching Posts
            </AlertTitle>
            <AlertDescription maxWidth="sm">
              {error}
            </AlertDescription>
            <Button colorScheme="primary" mt={4} onClick={fetchPosts} isLoading={isLoading}>
              Try Again
            </Button>
          </Alert>
        )}

        {!isLoading && !error && posts.length === 0 && (
          <Center minH="200px" flexDirection="column">
            <Text fontSize="xl" color="lightText">
              No posts available yet. Check back soon!
            </Text>
            {/* Optionally, a button to create post if logged in, or refresh */}
          </Center>
        )}

        {!error && posts.length > 0 && (
          <SimpleGrid 
            columns={{ base: 1, md: 2, lg: 3 }} 
            spacing={{ base: '1.5rem', md: '2rem' }} 
          >
            {posts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </SimpleGrid>
        )}
        {/* Pagination controls could go here */}
      </Container>
    </Box>
  );
};

export default HomePage;
