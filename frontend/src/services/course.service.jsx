// frontend/src/services/course.service.jsx

const API_URL = 'http://localhost:8080/api/courses/'; // Base URL for course endpoints

// Helper function to get the authorization header from localStorage
const getAuthHeader = () => {
  const jwtToken = localStorage.getItem('jwtToken');
  console.log("getAuthHeader - jwtToken from localStorage:", jwtToken); // Debug log
  if (jwtToken) {
    // Ensure there are no extra spaces or invalid characters
    const header = { 'Authorization': `Bearer ${jwtToken.trim()}` };
    console.log("getAuthHeader - Constructed Header:", header); // Debug log
    return header;
  }
  console.log("getAuthHeader - No JWT token found in localStorage."); // Debug log
  return {};
};

class CourseService {
  // Fetches all courses
  async getAllCourses() {
    try {
      // Get the header just before making the fetch call to ensure it's fresh
      const headers = {
        'Content-Type': 'application/json',
        ...getAuthHeader(), // Include the JWT token for authentication
      };
      console.log("getAllCourses - Request Headers:", headers); // Debug log

      const response = await fetch(API_URL, {
        method: 'GET',
        headers: headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP Error! Status: ${response.status}, Message: ${errorText || 'Failed to fetch courses.'}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error in getAllCourses:', error);
      throw error;
    }
  }

  // ... (other methods like getCourseById, createCourse, updateCourse, deleteCourse remain the same) ...
  async getCourseById(id) {
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      };
      const response = await fetch(`${API_URL}${id}`, {
        method: 'GET',
        headers: headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP Error! Status: ${response.status}, Message: ${errorText || `Failed to fetch course with ID ${id}.`}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error in getCourseById:', error);
      throw error;
    }
  }

  async createCourse(courseData) {
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      };
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(courseData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP Error! Status: ${response.status}, Message: ${errorText || 'Failed to create course. Please check input data.'}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error in createCourse:', error);
      throw error;
    }
  }

  async updateCourse(id, courseData) {
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      };
      const response = await fetch(`${API_URL}${id}`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(courseData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP Error! Status: ${response.status}, Message: ${errorText || `Failed to update course with ID ${id}.`}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error in updateCourse:', error);
      throw error;
    }
  }

  async deleteCourse(id) {
    try {
      const headers = {
        ...getAuthHeader(),
      };
      const response = await fetch(`${API_URL}${id}`, {
        method: 'DELETE',
        headers: headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP Error! Status: ${response.status}, Message: ${errorText || `Failed to delete course with ID ${id}.`}`);
      }

      if (response.status === 204) {
        return { message: 'Course deleted successfully (204 No Content)' };
      }
      return response.json();
    } catch (error) {
      console.error('Error in deleteCourse:', error);
      throw error;
    }
  }
}

export default new CourseService();