import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import Button from "../components/ui/Button";
import PageLayout from "../components/layout/PageLayout";

export default function SetupPage() {
  const navigate = useNavigate();
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");

  const handleStartGame = () => {
    if (player1.trim() && player2.trim()) {
      navigate("/game", { state: { player1, player2 } });
    }
  };

  return (
    <PageLayout className="flex items-center justify-center">
      <motion.div 
        className="w-full max-w-md p-8 space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Configuración del Juego</h1>
          <p className="text-gray-600">Ingresa los nombres de los jugadores para comenzar</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-blue-100 p-3 rounded-full">
              <span className="text-blue-600 text-xl">👥</span>
            </div>
            <h2 className="ml-3 text-xl font-semibold text-gray-800">2 Jugadores</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="player1" className="block text-sm font-medium text-gray-700 mb-1">
                Jugador 1
              </label>
              <input
                id="player1"
                type="text"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Nombre del primer jugador"
                value={player1}
                onChange={(e) => setPlayer1(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="player2" className="block text-sm font-medium text-gray-700 mb-1">
                Jugador 2
              </label>
              <input
                id="player2"
                type="text"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Nombre del segundo jugador"
                value={player2}
                onChange={(e) => setPlayer2(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col space-y-3 pt-4">
            <Button
              onClick={handleStartGame}
              size="lg"
              variant="primary"
              disabled={!player1.trim() || !player2.trim()}
              className="w-full justify-center py-3 text-base font-medium"
            >
              Empezar Juego
            </Button>
            <Button
              onClick={() => navigate("/")}
              variant="ghost"
              className="w-full justify-center py-3 text-base font-medium text-gray-700 hover:bg-gray-100"
            >
              Volver al Inicio
            </Button>
          </div>
        </div>
      </motion.div>
    </PageLayout>
  );
}