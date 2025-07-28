import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from '../App'; // Your main App component
import LoginPage from '../pages/LoginPage'; // We'll create this soon
import RegisterPage from '../pages/RegisterPage'; // We'll create this soon
import DashboardPage from '../pages/DashboardPage'; // We'll create this soon

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/', // Default route for App, could be a landing page or redirect
        element: <DashboardPage />, // For now, let's make dashboard the default after login
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
      // Add more routes here as your application grows
    ],
  },
]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;