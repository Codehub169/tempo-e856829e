import React from 'react';
import { Box, Flex, Link as ChakraLink, Text, List, ListItem, Button, useColorModeValue } from '@chakra-ui/react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const bgColor = useColorModeValue('white', 'gray.800');
  const activeLinkColor = useColorModeValue('primary', 'primary'); // 'primary' is a direct key from theme
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const navItemColor = useColorModeValue('text', 'whiteAlpha.900'); // 'text' is a direct key from theme

  const handleLogout = async () => {
    await logout();
    navigate('/login'); // Navigate after logout completes
  };

  const NavItem = ({ to, children }) => (
    <ListItem>
      <ChakraLink
        as={NavLink}
        to={to}
        fontWeight="500"
        _hover={{ color: activeLinkColor }}
        _activeLink={{ color: activeLinkColor, fontWeight: "bold" }}
        px={2}
        py={1}
        color={navItemColor}
      >
        {children}
      </ChakraLink>
    </ListItem>
  );

  return (
    <Box 
      bg={bgColor} 
      boxShadow="sm" 
      py={4} 
      position="sticky" 
      top={0} 
      zIndex={1000} 
      borderBottom="1px" 
      borderColor={borderColor}
    >
      <Flex
        maxW={{ base: '90%', md: '1100px' }}
        mx="auto"
        alignItems="center"
        justifyContent="space-between"
      >
        <ChakraLink as={NavLink} to="/" _hover={{ textDecoration: 'none' }}>
          <Text fontFamily="heading" fontSize={{ base: '1.5rem', md: '1.8rem' }} fontWeight="700" color="primary">
            SimpleBlog
          </Text>
        </ChakraLink>
        <nav>
          <List display="flex" alignItems="center" gap={{ base: '0.5rem', md: '1.5rem' }}>
            <NavItem to="/">Home</NavItem>
            {user ? (
              <>
                <NavItem to="/create-post">Create Post</NavItem>
                <ListItem>
                  <Button onClick={handleLogout} variant="ghost" colorScheme="primary" size="sm" fontWeight="500">
                    Logout
                  </Button>
                </ListItem>
              </>
            ) : (
              <>
                <NavItem to="/login">Login</NavItem>
                <NavItem to="/register">Register</NavItem>
              </>
            )}
          </List>
        </nav>
      </Flex>
    </Box>
  );
};

export default Navbar;
