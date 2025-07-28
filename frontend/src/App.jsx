import { useState } from 'react'
// You might need to adjust the CSS import path depending on your project (App.css or index.css)
import './index.css' // Or './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    // Added Tailwind classes:
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 text-gray-800 p-8">
      <h1 className="text-5xl font-extrabold text-indigo-700 mb-6 drop-shadow-lg">
        Personalized Learning Platform
      </h1>
      <div className="bg-white p-8 rounded-xl shadow-2xl space-y-4 max-w-md w-full text-center">
        <p className="text-lg text-gray-700 mb-4">
          Welcome! Your frontend is ready for development with Tailwind CSS.
        </p>
        <button
          onClick={() => setCount((count) => count + 1)}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          Click me: {count}
        </button>
        <p className="mt-4 text-sm text-gray-500">
          Edit <code>src/App.jsx</code> and save to test HMR.
        </p>
      </div>
    </div>
  )
}

export default App