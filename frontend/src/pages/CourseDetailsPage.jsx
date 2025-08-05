// frontend/src/pages/CourseDetailsPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import courseService from '../services/course.service';

const CourseDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollmentMessage, setEnrollmentMessage] = useState(null);

  // HIGHLIGHT: NEW STATE TO TRACK IF THE USER IS ALREADY ENROLLED
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const fetchCourseAndEnrollmentStatus = async () => {
      try {
        setLoading(true);
        setError(null);
        setEnrollmentMessage(null);

        // Fetch course details
        const courseData = await courseService.getCourseById(id);
        if (courseData) {
          setCourse(courseData); 
        } else {
          setError("Course not found.");
        }
        
        // HIGHLIGHT: FETCH ALL ENROLLED COURSES FOR THE CURRENT USER
        // This is a crucial step to check the user's enrollment status
        const enrolledCourses = await courseService.getEnrolledCourses();
        const isUserEnrolled = enrolledCourses.some(enrolledCourse => enrolledCourse.id.toString() === id);
        setIsEnrolled(isUserEnrolled);

      } catch (e) {
        console.error("Error fetching data:", e);
        // This catch block will handle network errors or API errors
        const errorMessage = e.message.includes('404')
          ? "Course not found."
          : e.message || "Failed to load course details. Please try again later.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndEnrollmentStatus();
  }, [id]);

  const handleEnrollment = async () => {
    // HIGHLIGHT: PREVENT ENROLLMENT IF ALREADY ENROLLED
    if (!course || isEnrolling || isEnrolled) return;

    setIsEnrolling(true);
    setEnrollmentMessage(null);

    try {
      await courseService.enrollInCourse(id);
      setEnrollmentMessage("Enrollment successful! You can now view this course on your dashboard.");
      setIsEnrolled(true); // Update the state immediately on success
    } catch (e) {
      console.error("Error during enrollment:", e);
      // HIGHLIGHT: CHECK FOR THE SPECIFIC DUPLICATE ENROLLMENT ERROR MESSAGE
      const errorMessage = e.message.includes('User is already enrolled') 
        ? "You are already enrolled in this course." 
        : `Enrollment failed: ${e.message}`;
      setEnrollmentMessage(errorMessage);
    } finally {
      setIsEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-xl font-semibold text-gray-700">Loading course details...</div>
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

  if (!course) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] p-4">
        <h2 className="text-2xl font-bold text-gray-800">Course not found.</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img 
              className="h-full w-full object-cover md:w-80"
              src={course.imageUrl || 'https://via.placeholder.com/600x800?text=Course+Image'} 
              alt={course.title} 
            />
          </div>
          <div className="p-8 flex flex-col justify-between w-full">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                {course.title}
              </h1>
              <p className="text-gray-600 text-lg mb-6">{course.description}</p>
              
              <div className="flex items-center text-gray-700 text-base mb-2">
                <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                <span>**Instructor:** {course.instructor}</span>
              </div>
              <div className="flex items-center text-gray-700 text-base mb-2">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>**Duration:** {course.duration}</span>
              </div>
              <div className="flex items-center text-gray-700 text-base mb-4">
                <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                <span>**Difficulty:** {course.difficulty}</span>
              </div>
              
              <div className="text-3xl font-extrabold text-indigo-600 mt-4 mb-4">
                ${course.price.toFixed(2)}
              </div>
            </div>
            
            {enrollmentMessage && (
                <div 
                    className={`p-3 rounded-lg text-white mb-4 ${
                        enrollmentMessage.includes('successful') ? 'bg-green-500' : 'bg-red-500'
                    }`}
                >
                    {enrollmentMessage}
                </div>
            )}

            <div className="mt-6 flex space-x-4">
              {/* HIGHLIGHT: CONDITIONAL RENDERING FOR THE ENROLLMENT BUTTON */}
              {isEnrolled ? (
                <button
                  className="flex-grow bg-green-600 text-white py-3 rounded-lg font-semibold cursor-not-allowed"
                  disabled
                >
                  You are already enrolled!
                </button>
              ) : (
                <button 
                  onClick={handleEnrollment}
                  className={`flex-grow text-white py-3 rounded-lg font-semibold transition duration-300
                      ${isEnrolling ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                  disabled={isEnrolling}
                >
                  {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
                </button>
              )}
              <button 
                onClick={() => navigate(-1)}
                className="flex-grow bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition duration-300"
              >
                Back to Courses
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;
