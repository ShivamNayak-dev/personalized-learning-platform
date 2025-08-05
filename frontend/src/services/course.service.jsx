// frontend/src/services/course.service.jsx

// Base URL for course endpoints
const API_URL = 'http://localhost:8080/api/courses/';

// Base URL for enrollment endpoints
const ENROLLMENTS_API_URL = 'http://localhost:8080/api/enrollments/';

// Helper function to get the authorization header from localStorage
const getAuthHeader = () => {
  const jwtToken = localStorage.getItem('jwtToken');
  if (jwtToken) {
    return { 'Authorization': `Bearer ${jwtToken.trim()}` };
  }
  return {};
};

class CourseService {
  // Fetches all courses from the API (protected endpoint)
  async getAllCourses() {
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      };
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

  // Fetches a single course by its ID (protected endpoint)
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

  // Creates a new course (protected endpoint)
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

  // Updates an existing course (protected endpoint)
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

  // Deletes a course (protected endpoint)
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

  // Sends a POST request to enroll the authenticated user in a specific course.
  async enrollInCourse(courseId) {
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      };
      
      const response = await fetch(`${ENROLLMENTS_API_URL}${courseId}`, {
        method: 'POST',
        headers: headers,
      });

      if (!response.ok) {
        // Read the error message from the response body
        const errorText = await response.text();
        throw new Error(`HTTP Error! Status: ${response.status}, Message: ${errorText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error in enrollInCourse:', error);
      throw error;
    }
  }

  // HIGHLIGHT: THIS IS THE MISSING METHOD
  async getEnrolledCourses() {
    try {
      const headers = getAuthHeader();
      const response = await fetch(`${ENROLLMENTS_API_URL}my-courses`, {
        method: 'GET',
        headers: headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP Error! Status: ${response.status}, Message: ${errorText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error in getEnrolledCourses:', error);
      throw error;
    }
  }
}

export default new CourseService();
