// src/lib/api.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.zerohealthinsurancebill.com/api';
const WORDPRESS_API_BASE_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_BASE_URL || 'https://backend.zerohealthinsurancebill.com/wp-json';

// Function to check if token is expired
const checkTokenExpiration = () => {
  if (typeof window === 'undefined') return false; // Skip during SSR
  
  const token = localStorage.getItem('token');
  if (!token) {
    return false; // No token doesn't mean expired for login endpoints
  }

  try {
    // Decode the token to get expiration time (assuming JWT token)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();

    // Check if token is expired
    if (currentTime > expirationTime) {
      return true; // Token is expired
    }
    return false;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true; // If we can't decode, treat as expired
  }
};

// Function to handle token expiration redirect
const handleTokenExpiration = () => {
  // Clear storage
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  
  // Redirect to login page if we're in the browser
  if (typeof window !== 'undefined') {
    window.location.href = '/admin/login';
  }
};

async function callApi(baseUrl, endpoint, method = 'GET', data = null, headers = {}, injectToken = true) {
  const url = `${baseUrl}${endpoint}`;

  // Check token expiration before making API call if token injection is required
  // BUT skip this check for login/signin endpoints to avoid blocking login attempts
  const isLoginEndpoint = endpoint.includes('/signin') || endpoint.includes('/login');
  
  if (injectToken && typeof window !== 'undefined' && !isLoginEndpoint) {
    if (checkTokenExpiration()) {
      handleTokenExpiration();
      // If token is expired, throw a specific error that can be handled by components
      const error = new Error('Token expired. Redirecting to login.');
      error.status = 401;
      error.redirectToLogin = true;
      throw error;
    }
    
    const token = localStorage.getItem('token');
    if (token) {
      headers['x-access-token'] = token;
    }
  }

  // Add CORS headers
  const corsHeaders = {
    'Accept': 'application/json',
    ...headers,
  };

  const config = {
    method,
    headers: {
      ...corsHeaders,
      // Don't set Content-Type for FormData - browser will set it automatically with boundary
      ...(data instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    },
    mode: 'cors', // Ensure CORS mode is enabled
  };

  if (data) {
    config.body = data instanceof FormData ? data : JSON.stringify(data);
  }

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      let errorData = {};
      try {
        errorData = await response.json();
      } catch (e) {
        errorData.message = `HTTP Error: ${response.status} ${response.statusText}`;
      }

      // Check for 401 Unauthorized status (token expired or invalid)
      // But skip redirect for login endpoints (login might fail due to wrong credentials)
      if (response.status === 401 && !isLoginEndpoint) {
        handleTokenExpiration();
        
        const error = new Error('Authentication failed. Redirecting to login.');
        error.status = response.status;
        error.data = errorData;
        error.redirectToLogin = true;
        throw error;
      }

      const error = new Error(errorData.message || `API Error: ${response.status}`);
      error.status = response.status;
      error.data = errorData;
      throw error;
    }

    return await response.json();
  } catch (error) {
    console.error(`Error calling API endpoint ${endpoint} with method ${method}:`, error);
    
    // If it's a token expiration error, don't re-throw as redirect is already handled
    if (error.redirectToLogin) {
      // The redirect has already been triggered, so we can silently handle this
      return null; // Return null to prevent further error handling in components
    }
    
    throw error;
  }
}

export const api = {
  get: (endpoint, headers = {}) => callApi(API_BASE_URL, endpoint, 'GET', null, headers, true),
  post: (endpoint, data, headers = {}, injectToken = true) => callApi(API_BASE_URL, endpoint, 'POST', data, headers, injectToken),
  put: (endpoint, data, headers = {}) => callApi(API_BASE_URL, endpoint, 'PUT', data, headers, true),
  patch: (endpoint, data, headers = {}) => callApi(API_BASE_URL, endpoint, 'PATCH', data, headers, true),
  del: (endpoint, headers = {}) => callApi(API_BASE_URL, endpoint, 'DELETE', null, headers, true),
};

export const wordpressApi = {
  get: (endpoint, headers = {}) => callApi(WORDPRESS_API_BASE_URL, endpoint, 'GET', null, headers, false),
};