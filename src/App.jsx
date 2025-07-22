import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from 'react';
import Navbar from "./components/Navbar";
import Animation from './components/Animation';
import Login from "./pages/Login";
import Profile from "./pages/profile";
import Register from "./pages/register";
import ProtectedRoute from "./components/protectedRoute";
import Workout from "./pages/workout";
import Home from "./pages/Home";
import { Toaster } from "sonner";

export default function App() {
  const [showNavbar, setShowNavbar] = useState(false);

  return (
    <div className="min-h-screen">
      <Router>
        {/* Preload routes but keep them hidden behind animation */}
        <div style={{ visibility: showNavbar ? 'visible' : 'hidden' }}>
          <Navbar />
        </div>
        <div className="w-full flex flex-col md:flex-row items-start p-6">
          <Routes>
            <Route element={<Home/>} path="/"/>
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route element={<Login/>} path="/login"/>
            <Route element={<Register/>} path="/register"/>
            <Route element={<Workout />} path="/workout/:id"/>
          </Routes>
        </div>
      </Router>
      
      {/* Animation stays on top until complete */}
      <Animation 
        onComplete={() => {
          // Only show navbar when animation is actually complete
          setShowNavbar(true);
        }} 
      />
      <Toaster />
    </div>
  );
}