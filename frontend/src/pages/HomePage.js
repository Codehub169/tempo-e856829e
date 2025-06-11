import React, { useEffect, useState } from 'react';
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
  AlertDescription
} from '@chakra-ui/react';
import BlogPostCard from '../components/BlogPostCard';
import apiService from '../services/apiService';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedPosts = await apiService.getPosts();
        setPosts(fetchedPosts.items || []); // Assuming API returns { items: [...] }
      } catch (err) {
        setError(err.message || 'Failed to fetch posts. Please try again later.');
        console.error('Error fetching posts:', err);
      }
      setIsLoading(false);
    };

    fetchPosts();
  }, []);

  return (
    <Box as="main" flexGrow={1} py={{ base: '1rem', md: '2rem' }}>
      <Container maxW="container.xl" className="container">
        <Heading 
          as="h1" 
          className="page-title" 
          fontFamily="heading" 
          fontSize={{ base: '2rem', md: '2.5rem' }} 
          color="brand.text" 
          mb={{ base: '1.5rem', md: '2rem' }} 
          textAlign="center"
        >
          Latest Posts
        </Heading>

        {isLoading && (
          <Center minH="300px">
            <Spinner size="xl" color="brand.primary" thickness="4px" />
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
            height="200px"
            borderRadius="md"
            my={8}
          >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              Error Fetching Posts
            </AlertTitle>
            <AlertDescription maxWidth="sm">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && posts.length === 0 && (
          <Center minH="200px">
            <Text fontSize="xl" color="brand.lightText">
              No posts available yet. Check back soon!
            </Text>
          </Center>
        )}

        {!isLoading && !error && posts.length > 0 && (
          <SimpleGrid 
            columns={{ base: 1, md: 2, lg: 3 }} 
            spacing={{ base: '1.5rem', md: '2rem' }} 
            className="blog-list"
          >
            {posts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </SimpleGrid>
        )}
      </Container>
    </Box>
  );
};

export default HomePage;
