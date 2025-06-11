import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, Flex } from '@chakra-ui/react';

import Navbar from './components/Navbar'; 
// Page imports - will be created in subsequent batches
import HomePage from './pages/HomePage';
import ViewPostPage from './pages/ViewPostPage';
import CreatePostPage from './pages/CreatePostPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Placeholder for a Footer component if needed later
const Footer = () => (
  <Box as="footer" bg="text" color="secondary" textAlign="center" py="1.5rem" mt="auto">
    <Box maxW="1100px" mx="auto" px="20px">
      &copy; {new Date().getFullYear()} SimpleBlog. All rights reserved. Crafted with care.
    </Box>
  </Box>
);

function App() {
  return (
    <Flex direction="column" minHeight="100vh">
      <Navbar />
      <Box as="main" flexGrow={1} py={{ base: "1rem", md: "2rem" }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/post/:postId" element={<ViewPostPage />} />
          <Route path="/create-post" element={<CreatePostPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* Add other routes here, e.g., for user profiles or search results */}
        </Routes>
      </Box>
      <Footer />
    </Flex>
  );
}

export default App;
