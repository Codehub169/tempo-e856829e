import React from 'react';
import { Box, Text, Button, Image, useColorModeValue, VStack, Heading, Spacer } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { format, isValid, parseISO } from 'date-fns'; // For date formatting

const BlogPostCard = ({ post }) => {
  const cardBgColor = useColorModeValue('cardBg', 'gray.700'); 
  const textColorVal = useColorModeValue('text', 'whiteAlpha.900');
  const lightTextColorVal = useColorModeValue('lightText', 'gray.400');
  const headingColorVal = useColorModeValue('text', 'whiteAlpha.900');
  const primaryColorVal = useColorModeValue('primary', 'primary'); // Assuming 'primary' is a key in theme.colors
  const placeholderImageTextColor = useColorModeValue('gray.600', 'gray.300');
  const placeholderBgColor = useColorModeValue('gray.200', 'gray.600');

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    try {
      const date = parseISO(dateString); // Handles ISO strings more robustly
      if (isValid(date)) {
        return format(date, 'MMMM dd, yyyy');
      }
      // If dateString is not a valid ISO string but might be pre-formatted or a placeholder
      return dateString; 
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString; // Fallback if date parsing/formatting fails
    }
  };

  // Defensive checks for post properties
  const title = post?.title || 'Untitled Post';
  const postId = post?.id || '#'; // Fallback for link, though an ID should always exist
  const authorName = post?.owner?.username || 'Unknown Author';
  const createdAtDate = formatDate(post?.created_at);
  const contentPreview = post?.content 
    ? (post.content.substring(0, 150) + (post.content.length > 150 ? '...' : '')) 
    : 'No content preview available.';

  return (
    <Box
      as="article"
      bg={cardBgColor}
      borderRadius="md"
      boxShadow="lg"
      overflow="hidden"
      display="flex"
      flexDirection="column"
      transition="transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out"
      _hover={{
        transform: 'translateY(-4px)',
        boxShadow: 'xl',
      }}
      height="100%" // Ensure cards in a grid have consistent height behavior
    >
      {post?.image_url ? (
        <Image 
          src={post.image_url} 
          alt={`Image for ${title}`}
          width="100%" 
          height="200px" 
          objectFit="cover" 
        />
      ) : (
        <Box 
          width="100%" 
          height="200px" 
          bg={placeholderBgColor}
          display="flex" 
          alignItems="center" 
          justifyContent="center"
          color={placeholderImageTextColor}
          fontSize="1.1rem"
          fontFamily="heading"
          textAlign="center"
          p={2}
        >
          Featured Image
        </Box>
      )}

      <VStack spacing={3} p={6} align="stretch" flexGrow={1}>
        <Heading 
          as={RouterLink} 
          to={`/post/${postId}`} 
          fontFamily="heading" 
          fontSize="xl" 
          fontWeight="600" 
          color={headingColorVal}
          _hover={{ color: primaryColorVal, textDecoration: 'none' }}
          noOfLines={2} // Prevent very long titles from breaking layout
          title={title} // Full title on hover if truncated
        >
          {title}
        </Heading>
        <Text fontSize="sm" color={lightTextColorVal}>
          By {authorName} on {createdAtDate}
        </Text>
        <Text fontSize="md" color={textColorVal} flexGrow={1} noOfLines={3}>
          {contentPreview}
        </Text>
        <Spacer />
        <Button 
          as={RouterLink} 
          to={`/post/${postId}`} 
          colorScheme="primary"
          alignSelf="flex-start"
          mt={2} 
        >
          Read More
        </Button>
      </VStack>
    </Box>
  );
};

export default BlogPostCard;
