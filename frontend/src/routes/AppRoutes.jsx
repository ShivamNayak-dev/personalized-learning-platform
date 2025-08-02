// frontend/src/routes/AppRoutes.jsx

// React Router v6.4+ imports for creating and providing a router
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// Layout component for the entire app. It contains the <Outlet /> for nested routes.
import App from '../App';
// Import all the page components
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import CourseList from '../components/CourseList'; 
import CourseDetailsPage from '../pages/CourseDetailsPage'; // <-- The new details page

// Create the router configuration for the application.
// This is a single source of truth for all routes.
const router = createBrowserRouter([
  {
    // The parent route for the entire application.
    // The 'element' here (App) acts as a layout component.
    path: '/',
    element: <App />, 
    children: [
      // Nested routes will render within the <Outlet /> of the parent App component.
      
      // Default route for the app, typically a dashboard or home page after login.
      {
        path: '/', 
        element: <DashboardPage />,
      },
      
      // Route for the user login page.
      {
        path: '/login',
        element: <LoginPage />,
      },
      
      // Route for the user registration page.
      {
        path: '/register',
        element: <RegisterPage />,
      },
      
      // Route for the user dashboard.
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      
      // Route to display the list of all available courses.
      {
        path: '/courses', 
        element: <CourseList />, 
      },
      
      // Route for the details of a specific course.
      // The ':id' is a dynamic URL parameter that will be used to fetch the course data.
      {
        path: '/courses/:id', 
        element: <CourseDetailsPage />, 
      },
    ],
  },
]);

// The main component that provides the router to the rest of the application.
// This component should be rendered once at the top of your component tree.
const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;