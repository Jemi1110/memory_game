import { useNavigate } from "react-router-dom";

export default function GameOverPage() {
    const navigate = useNavigate();
    return (
        <div>
            <h1>Game Over</h1>
            <p>Has perdido</p>
            <button className="mt-4" onClick={() => navigate("/setup")}>Volver al menu</button>
        </div>
    );
}