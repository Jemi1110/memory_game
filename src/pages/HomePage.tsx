import { useNavigate } from "react-router-dom";

export default function HomePage() {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center justify-center h-screen text-white">
            <h1 className="text-4xl font-bold ">Memory Game</h1>
            <p>
                <strong>Objetivo:</strong> obtener 500 puntos
                <br />
                <strong>Tiempo por turno:</strong> 10 segundos
                <br />
                <strong>Puntos por Velocidad:</strong>
                <ul>
                    <li>⚡ 8-10 seg = 50 puntos (Rápido)</li>
                    <li>🏃 5-7 seg  = 75 puntos (Muy rápido)</li>
                    <li>🚀 1-4 seg  = 100 puntos (Súper rápido)</li>
                    <li>🐌 0 seg    = -25 puntos (Tiempo agotado)</li>
                </ul>
                <br />
                <strong>Bonificaciones:</strong>
                <ul>
                    <li>🔥 3 correctas seguidas = +25 puntos bonus</li>
                    <li>🎯 5 correctas seguidas = +50 puntos bonus</li>
                    <li>💎 7 correctas seguidas = +100 puntos bonus</li>
                </ul>
                <br />
                <strong>Penalizaciones:</strong>
                <ul>
                    <li>❌ Respuesta incorrecta = -15 puntos</li>
                    <li>⏰ Tiempo agotado = -25 puntos</li>
                </ul>
            </p>
            <h1>¿Estás listo para jugar?</h1>
            <button onClick={() => navigate("/setup")}>Empecemos</button>
        </div>
    );
}