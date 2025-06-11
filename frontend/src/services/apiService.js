import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api/v1';

const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const loginUser = async (identifier, password) => {
  const params = new URLSearchParams();
  params.append('username', identifier); // FastAPI's OAuth2PasswordRequestForm expects 'username'
  params.append('password', password);
  
  return apiClient.post('/users/token', params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};

export const registerUser = async (userData) => { // { username, email, password }
  return apiClient.post('/users/register', userData);
};

export const getCurrentUser = async () => {
  return apiClient.get('/users/me');
};

export const createPost = async (postData) => { // { title, content, image_url? }
  return apiClient.post('/posts/', postData); // Path matches backend: /api/v1/posts/
};

export const getPosts = async (page = 1, limit = 10) => {
  return apiClient.get('/posts/', { params: { skip: (page - 1) * limit, limit: limit } }); // Path matches backend: /api/v1/posts/
};

export const getPostById = async (postId) => {
  return apiClient.get(`/posts/${postId}`);
};

export const updatePost = async (postId, postData) => {
  return apiClient.put(`/posts/${postId}`, postData);
};

export const deletePost = async (postId) => {
  return apiClient.delete(`/posts/${postId}`);
};

// Consolidating all functions into a single default export object is a common pattern.
// Alternatively, each function could be a named export without this additional object.
// The current approach is fine.
const apiService = {
  loginUser,
  registerUser,
  getCurrentUser,
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
};

export default apiService;
