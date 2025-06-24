import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import SetupPage from "../pages/SetupPage";
import GamePage from "../pages/GamePage";
import GameOverPage from "../pages/GameOverPage";

export default function Router() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={<Navigate to="/" />} />

            <Route path="/setup" element={<SetupPage />} />
            
            <Route path="/game" element={<GamePage />} />
            <Route path="/game-over" element={<GameOverPage />} />
        </Routes>


    );
}