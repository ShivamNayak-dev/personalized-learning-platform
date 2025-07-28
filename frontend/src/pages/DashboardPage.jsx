import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const [message, setMessage] = useState('Loading protected content...');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProtectedData = async () => {
      const jwtToken = localStorage.getItem('jwtToken');

      if (!jwtToken) {
        navigate('/login'); // Redirect to login if no token
        return;
      }

      try {
        const response = await fetch('http://localhost:8080/api/auth/test/protected', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}` // Attach the JWT
          }
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            // Token invalid or expired, force re-login
            localStorage.removeItem('jwtToken');
            navigate('/login');
            throw new Error('Session expired or unauthorized. Please log in again.');
          }
          const errorText = await response.text();
          throw new Error(errorText || 'Failed to fetch protected data.');
        }

        const data = await response.text(); // Assuming protected endpoint returns plain text
        setMessage(data);

      } catch (err) {
        console.error('Error fetching protected data:', err.message);
        setError(err.message);
        setMessage('Failed to load protected content.');
      }
    };

    fetchProtectedData();
  }, [navigate]); // navigate is a dependency of useEffect

  const handleLogout = () => {
    localStorage.removeItem('jwtToken'); // Clear the token
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg text-center">
        <h1 className="text-4xl font-bold text-green-700 mb-6">Welcome to Your Dashboard!</h1>
        <p className="text-gray-700 text-lg mb-4">
          Here's the message from the protected backend endpoint:
        </p>
        {error ? (
          <p className="text-red-500 font-semibold mb-6">{error}</p>
        ) : (
          <p className="text-blue-600 font-semibold mb-6">{message}</p>
        )}
        <button
          onClick={handleLogout}
          className="mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;