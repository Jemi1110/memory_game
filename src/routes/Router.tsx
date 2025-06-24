import React from 'react';
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import HomePage from "../pages/HomePage";
import SetupPage from "../pages/SetupPage";
import GamePage from "../pages/GamePage";
import GameOverPage from "../pages/GameOverPage";

// Protected route component
function RequireGameState({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  
  if (!location.state) {
    // Redirect to setup if no state is provided
    return <Navigate to="/setup" state={{ from: location }} replace />;
  }
  
  return children;
}

export default function Router() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={<Navigate to="/" />} />

            <Route path="/setup" element={<SetupPage />} />
            
            <Route 
              path="/game" 
              element={
                <RequireGameState>
                  <GamePage />
                </RequireGameState>
              } 
            />
            <Route path="/game-over" element={<GameOverPage />} />
        </Routes>


    );
}