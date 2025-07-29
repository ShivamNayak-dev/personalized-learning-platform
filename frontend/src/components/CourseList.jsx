// frontend/src/components/CourseList.jsx
import React, { useState, useEffect } from 'react';
import courseService from '../services/course.service'; // Import our new service

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await courseService.getAllCourses();
        setCourses(data);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses. Please try again later.");
        // Optionally, handle specific error codes like 401 for re-login
        if (err.message && (err.message.includes('401') || err.message.includes('403'))) {
            // You might want to navigate to login here if the token is invalid/expired
            // Example: navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []); // Empty dependency array means this effect runs once on component mount

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-xl font-semibold text-gray-700">Loading courses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline ml-2">{error}</span>
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] text-center p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">No Courses Available</h2>
        <p className="text-gray-600">It looks like there are no courses yet. Check back later or add one if you have admin access!</p>
        {/* Optional: Add a button to navigate to the Add Course page */}
        {/* <button className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition duration-300">
          Add First Course
        </button> */}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Explore Our Courses</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {courses.map(course => (
          <div
            key={course.id}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200"
          >
            {/* Course Image */}
            <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden">
              <img
                src={course.imageUrl || 'https://via.placeholder.com/400x250?text=Course+Image'}
                alt={course.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute top-0 right-0 bg-indigo-600 text-white text-sm font-semibold px-3 py-1 rounded-bl-lg">
                ${course.price.toFixed(2)}
              </div>
            </div>

            {/* Course Details */}
            <div className="p-5 flex flex-col justify-between h-[calc(100%-12rem)] sm:h-[calc(100%-14rem)] lg:h-[calc(100%-16rem)]"> {/* Adjust height calculation based on image */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2 truncate">
                  {course.title}
                </h2>
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                  {course.description}
                </p>
              </div>

              <div className="mt-auto"> {/* Pushes content to the bottom */}
                <div className="flex items-center text-gray-700 text-sm mb-2">
                  <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                  <span>{course.instructor}</span>
                </div>
                <div className="flex items-center text-gray-700 text-sm mb-2">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center text-gray-700 text-sm mb-4">
                  <svg className="w-4 h-4 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  <span>Difficulty: {course.difficulty}</span>
                </div>

                {/* Action Buttons (e.g., View Details, Enroll - will add Edit/Delete later) */}
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseList;