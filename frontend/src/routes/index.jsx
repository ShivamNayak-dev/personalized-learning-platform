// frontend/src/routes/AppRoutes.jsx

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from '../App'; // Your main App component
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';

// Import the new CourseList component
import CourseList from '../components/CourseList'; // ADD THIS LINE

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // App is the layout component
    children: [
      {
        path: '/', // Default route for App's Outlet, will show Dashboard after login
        element: <DashboardPage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      // ADD THE NEW ROUTE FOR COURSES HERE
      {
        path: '/courses', // The URL path for our course list
        element: <CourseList />, // The component to render at this path
      },
      // Add more routes here as your application grows
    ],
  },
]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;