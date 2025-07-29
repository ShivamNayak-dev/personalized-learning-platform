import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // To redirect after login

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    setError(''); // Clear previous errors

    try {
      // Send login request to your backend
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        // If response is not OK (e.g., 401 Unauthorized, 400 Bad Request)
        const errorData = await response.text(); // Get error message from backend
        throw new Error(errorData || 'Login failed. Please check your credentials.');
      }

      const jwtToken = await response.text(); // Your backend returns the JWT as plain text
      console.log('Login successful! JWT:', jwtToken);

      // Store the JWT token (e.g., in localStorage)
      localStorage.setItem('jwtToken', jwtToken);

      // Redirect to dashboard or home page
      navigate('/dashboard');

    } catch (err) {
      console.error('Login error:', err.message);
      setError(err.message); // Display error message to user
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-indigo-800 mb-6">Login</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
              Username (Email)
            </label>
            <input
              type="email"
              id="username"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-indigo-800 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full cursor-pointer"
            >
              Sign In
            </button>
          </div>
          <p className="text-center text-gray-600 text-sm mt-4">
            Don't have an account?{' '}
            <a href="/register" className="text-indigo-600 hover:text-indigo-800 font-bold">
              Register here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;