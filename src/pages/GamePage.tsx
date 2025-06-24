import { useLocation } from "react-router-dom";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Player, Card, GameState } from '../types';
import GameBoard from '../components/GameBoard';

export default function GamePage() {
    const navigate = useNavigate();
    const [players, setPlayers] = useState<Player[]>([
        { id: '1', name: 'Jugador 1', score: 0, consecutiveCorrect: 0, turnOrder: 1 },
        { id: '2', name: 'Jugador 2', score: 0, consecutiveCorrect: 0, turnOrder: 2 }
    ]);
    const [gameState, setGameState] = useState<GameState>({
        players: {
            players,
            currentTurn: 0
        },
        currentTurn: 0,
        startTime: 0,
        maxScore: 500,
        timePerTurn: 10000,
        currentCard: {
            id: Date.now(),
            type: 'color',
            value: '',
            revealed: true,
            matched: false
        },
        memoryWords: [],
        gameStarted: false,
        gameEnded: false,
        consecutiveCorrect: 0
    });

    const handleGameOver = (winner: Player) => {
        alert(`¡Juego terminado! El ganador es: ${winner.name}`);
        navigate('/');
    };

    const handlePlayerCorrect = (player: Player, points: number) => {
        setGameState(prev => ({
            ...prev,
            players: {
                players: prev.players.players.map(p => 
                    p.id === player.id ? 
                        { ...p, score: p.score + points, consecutiveCorrect: p.consecutiveCorrect + 1 } : 
                        p
                ),
                currentTurn: prev.players.currentTurn
            }
        }));
    };

    const handlePlayerIncorrect = (player: Player) => {
        setGameState(prev => ({
            ...prev,
            players: {
                players: prev.players.players.map(p => 
                    p.id === player.id ? 
                        { ...p, score: Math.max(0, p.score - 15), consecutiveCorrect: 0 } : 
                        p
                ),
                currentTurn: prev.players.currentTurn
            }
        }));
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen text-white">
            <h1 className="text-4xl font-bold">TUTTI FRUTTI MEMORY CARD</h1>
            <GameBoard
                players={players}
                maxScore={gameState.maxScore}
                timePerTurn={gameState.timePerTurn}
                onGameOver={handleGameOver}
                onPlayerCorrect={handlePlayerCorrect}
                onPlayerIncorrect={handlePlayerIncorrect}
            />
        </div>
    );
}