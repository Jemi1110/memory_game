import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SetupPage() {
const navigate = useNavigate();
const [player1, setPlayer1] = useState("");
const [player2, setPlayer2] = useState("");

    return (
        <div className="flex flex-col items-center justify-center h-screen text-white">
            <h1>Configuración de Juego </h1>

            <h1>Cantidad de Jugadores</h1>
            <h2>Este juego es para 2 personas</h2>

            <h1 className="mt-4 " >Ingrese primer nombre</h1>
            <input type="text" className="mt-4" placeholder="Ingrese primer nombre" value={player1} onChange={(e) => setPlayer1(e.target.value)} />

            <h1 className="mt-4" >Ingrese segundo nombre</h1>
            <input type="text" className="mt-4" placeholder="Ingrese segundo nombre" value={player2} onChange={(e) => setPlayer2(e.target.value)} />

            <div className="flex justify-center">
                <button className="mt-4 bg-blue-500 text-white" onClick={() => navigate("/game", { state: { player1, player2 } })}>Empecemos</button>
                <button className="mt-4 bg-red-500 text-white" onClick={() => navigate("/")}>Volver</button>
            </div>
        </div>
    );
}