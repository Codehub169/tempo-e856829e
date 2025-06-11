import React from 'react';
import { Box, Text, Link as ChakraLink, Button, Image, useColorModeValue, VStack, Heading, Spacer } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { format } from 'date-fns'; // For date formatting

const BlogPostCard = ({ post }) => {
  const cardBgColor = useColorModeValue('brand.cardBg', 'gray.700');
  const textColor = useColorModeValue('brand.text', 'whiteAlpha.900');
  const lightTextColor = useColorModeValue('brand.lightText', 'gray.400');
  const headingColor = useColorModeValue('brand.text', 'whiteAlpha.900');
  const primaryColor = useColorModeValue('brand.primary', 'brand.primary');

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy');
    } catch (error) {
      return dateString; // Fallback if date is not valid
    }
  };

  return (
    <Box
      as="article"
      bg={cardBgColor}
      borderRadius="md"
      boxShadow="lg"
      overflow="hidden"
      display="flex"
      flexDirection="column"
      transition="transform 0.3s ease, box-shadow 0.3s ease"
      _hover={{
        transform: 'translateY(-5px)',
        boxShadow: 'xl',
      }}
    >
      {post.image_url ? (
        <Image 
          src={post.image_url} 
          alt={`Image for ${post.title}`} 
          width="100%" 
          height="200px" 
          objectFit="cover" 
        />
      ) : (
        <Box 
          width="100%" 
          height="200px" 
          bg="gray.300" 
          display="flex" 
          alignItems="center" 
          justifyContent="center"
          color="white"
          fontSize="1.2rem"
          fontFamily="heading"
        >
          Featured Image
        </Box>
      )}

      <VStack spacing={3} p={6} align="stretch" flexGrow={1}>
        <Heading 
          as={RouterLink} 
          to={`/post/${post.id}`} 
          fontFamily="heading" 
          fontSize="xl" 
          fontWeight="600" 
          color={headingColor}
          _hover={{ color: primaryColor, textDecoration: 'none' }}
        >
          {post.title}
        </Heading>
        <Text fontSize="sm" color={lightTextColor}>
          By {post.owner?.username || 'Unknown Author'} on {formatDate(post.created_at)}
        </Text>
        <Text fontSize="md" color={textColor} flexGrow={1} noOfLines={3}>
          {post.content.substring(0, 150)}{post.content.length > 150 ? '...' : ''}
        </Text>
        <Spacer />
        <Button 
          as={RouterLink} 
          to={`/post/${post.id}`} 
          colorScheme="brandPrimary" 
          alignSelf="flex-start"
        >
          Read More
        </Button>
      </VStack>
    </Box>
  );
};

export default BlogPostCard;
