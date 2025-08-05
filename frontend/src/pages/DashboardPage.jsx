// frontend/src/pages/DashboardPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import courseService from '../services/course.service';

const DashboardPage = () => {
  // State to manage the list of enrolled courses, loading status, and any errors.
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Define an async function to fetch the data
    const fetchEnrolledCourses = async () => {
      const jwtToken = localStorage.getItem('jwtToken');

      if (!jwtToken) {
        // If there's no token, the user is not authenticated. Redirect to login.
        navigate('/login');
        return;
      }

      try {
        setLoading(true); // Start loading
        setError(null);    // Clear any previous errors

        // Call the service method to get the list of enrolled courses
        const courses = await courseService.getEnrolledCourses();
        setEnrolledCourses(courses); // Set the state with the fetched courses
      } catch (e) {
        console.error("Error fetching enrolled courses:", e);
        // Handle unauthorized errors specifically
        if (e.message.includes('401') || e.message.includes('403')) {
          localStorage.removeItem('jwtToken');
          navigate('/login');
          setError("Session expired or unauthorized. Please log in again.");
        } else {
          setError("Failed to fetch your enrolled courses. Please try again later.");
        }
      } finally {
        setLoading(false); // Stop loading regardless of success or failure
      }
    };

    fetchEnrolledCourses();
  }, [navigate]); // The dependency array includes 'navigate' because it's used inside the effect

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8">
        <h1 className="text-4xl font-bold text-green-700 mb-6">Welcome to Your Dashboard!</h1>
        <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg text-center">
            <div className="text-xl font-semibold text-gray-700">Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8">
        <h1 className="text-4xl font-bold text-green-700 mb-6">Welcome to Your Dashboard!</h1>
        <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline ml-2">{error}</span>
            </div>
            <button
              onClick={handleLogout}
              className="mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline cursor-pointer transition duration-300"
            >
              Logout
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-4xl">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Your Enrolled Courses</h1>
        
        {enrolledCourses.length === 0 ? (
          <div className="text-center p-8 bg-gray-100 rounded-lg">
            <p className="text-xl text-gray-600 mb-4">You are not enrolled in any courses yet.</p>
            <Link 
              to="/courses" 
              className="inline-block bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg 
                         hover:bg-indigo-700 transition duration-300"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {enrolledCourses.map(course => (
              <div 
                key={course.id} 
                className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl"
              >
                <img 
                  className="w-full h-48 object-cover" 
                  src={course.imageUrl || 'https://via.placeholder.com/600x400?text=Course+Image'} 
                  alt={course.title} 
                />
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h2>
                  <p className="text-gray-600 text-sm mb-4">by {course.instructor}</p>
                  <Link 
                    to={`/courses/${course.id}`}
                    className="block text-center bg-indigo-500 text-white py-2 rounded-lg font-semibold 
                               hover:bg-indigo-600 transition duration-300"
                  >
                    Go to Course
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-8 text-center">
            <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline cursor-pointer transition duration-300"
            >
              Logout
            </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
