import { Outlet } from 'react-router-dom';
import './index.css'; // Make sure your main CSS is imported here

function App() {
  // App component acts as a layout. Content from nested routes will render in <Outlet />
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header/Navbar can go here if global */}
      <main className="flex-grow">
        <Outlet /> {/* This is where your routed components (Login, Register, Dashboard) will render */}
      </main>
      {/* Footer can go here if global */}
    </div>
  );
}

export default App;