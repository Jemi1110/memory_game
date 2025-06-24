import { useState, useEffect, useRef, useContext } from 'react';
import styles from './GameBoard.module.css';
import { AudioContext } from '../utils/audio';
import type { Player, GameState, Card } from '../types';
import type { SoundType } from '../utils/audio';

const COLOR_EMOJIS = ['🔴', '🟢', '🔵', '🟡', '🟠', '🟣', '⚫', '⚪', '🟤', '🩷'];
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

interface GameBoardProps {
    players: Player[];
    maxScore: number;
    timePerTurn: number;
    onGameOver: (winner: Player) => void;
    onPlayerCorrect: (player: Player, points: number) => void;
    onPlayerIncorrect: (player: Player) => void;
}

export default function GameBoard({ players, maxScore, timePerTurn, onGameOver, onPlayerCorrect, onPlayerIncorrect }: GameBoardProps) {
    const [gameState, setGameState] = useState<GameState>({
        players: {
            players: players.map((player, index) => ({
                id: player.id,
                name: player.name,
                score: player.score,
                consecutiveCorrect: 0,
                turnOrder: index + 1
            })),
            currentTurn: 0
        },
        currentTurn: 0,
        startTime: 0,
        maxScore: maxScore,
        timePerTurn: timePerTurn,
        currentCard: {
            id: Date.now(),
            type: 'color',
            value: COLOR_EMOJIS[0],
            revealed: true,
            matched: false
        },
        memoryWords: [],
        gameStarted: false,
        gameEnded: false,
        consecutiveCorrect: 0
    });

    const { audioEnabled: contextAudioEnabled, toggleAudio: contextToggleAudio, playSound: contextPlaySound } = useContext(AudioContext);

    const playSound = (soundType: SoundType) => {
        if (!contextAudioEnabled) return;
        contextPlaySound(soundType);
    };

    const toggleAudio = () => {
        contextToggleAudio();
    };

    useEffect(() => {
        const initializeGame = () => {
            const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
            setGameState({
                players: {
                    players: shuffledPlayers.map((player, index) => ({
                        ...player,
                        turnOrder: index + 1,
                        consecutiveCorrect: 0
                    })),
                    currentTurn: 0
                },
                currentTurn: 0,
                startTime: 0,
                maxScore: maxScore,
                timePerTurn: timePerTurn,
                currentCard: {
                    id: Date.now(),
                    type: 'color',
                    value: COLOR_EMOJIS[0],
                    revealed: true,
                    matched: false
                },
                memoryWords: [],
                gameStarted: true,
                gameEnded: false,
                consecutiveCorrect: 0
            });
        };

        if (!gameState.gameStarted) {
            initializeGame();
        }
    }, [players, maxScore, timePerTurn]);

    const timerRef = useRef<NodeJS.Timeout | undefined>();

    const getRandomCard = (): Card => {
        const type = Math.random() < 0.5 ? 'color' : 'letter';
        const values = type === 'color' ? COLOR_EMOJIS : LETTERS;
        const value = values[Math.floor(Math.random() * values.length)];
        return {
            id: Date.now(),
            type,
            value,
            revealed: true,
            matched: false
        };
    };

    const getMemoryWords = (turn: number): string[] => {
        const windowSize = 3;
        const start = Math.max(0, turn - windowSize);
        const end = turn;
        return gameState.memoryWords.slice(start, end);
    };

    const startNextTurn = () => {
        if (gameState.gameEnded) return;

        const nextTurn = gameState.currentTurn + 1;

        setGameState(prev => ({
            ...prev,
            currentTurn: nextTurn,
            startTime: Date.now(),
            currentCard: getRandomCard(),
            memoryWords: getMemoryWords(prev.currentTurn)
        }));

        playSound('turnStart');

        timerRef.current = setTimeout(() => {
            handleTimeOut();
        }, timePerTurn);
    };

    const handleTimeOut = () => {
        const currentPlayerIndex = gameState.currentTurn % gameState.players.players.length;
        const currentPlayer = gameState.players.players[currentPlayerIndex];
        playSound('timeout');
        onPlayerIncorrect(currentPlayer);
        startNextTurn();
    };

    const handlePlayerResponse = (correct: boolean, words: string[]) => {
        const currentPlayerIndex = gameState.currentTurn % gameState.players.players.length;
        const currentPlayer = gameState.players.players[currentPlayerIndex];
        const timeTaken = Date.now() - gameState.startTime;
        const points = calculatePoints(timeTaken, correct, gameState.timePerTurn, gameState.consecutiveCorrect);

        if (correct) {
            playSound('correct');
            onPlayerCorrect(currentPlayer, points);
        } else {
            playSound('incorrect');
            onPlayerIncorrect(currentPlayer);
        }

        setGameState(prev => ({
            ...prev,
            consecutiveCorrect: correct ? prev.consecutiveCorrect + 1 : 0,
            memoryWords: [...prev.memoryWords, ...words]
        }));

        checkWinner();
        startNextTurn();
    };

    const calculatePoints = (timeTaken: number, correct: boolean, timePerTurn: number, consecutiveCorrect: number): number => {
        if (!correct) return -15;
        const basePoints = 100;
        const timeBonus = Math.max(0, (timePerTurn - timeTaken) / 1000);
        const consecutiveBonus = consecutiveCorrect * 25;
        return basePoints + timeBonus + consecutiveBonus;
    };

    const checkWinner = () => {
        const winner = gameState.players.players.find(player => player.score >= gameState.maxScore);
        if (winner) {
            playSound('victory');
            setGameState(prev => ({
                ...prev,
                gameEnded: true,
                players: {
                    ...prev.players,
                    players: prev.players.players.map(player => ({ ...player, score: player.score >= gameState.maxScore ? player.score : 0 }))
                }
            }));
            onGameOver(winner);
        }
    };

    const renderGameBoard = () => {
        const currentPlayerIndex = gameState.players.currentTurn % gameState.players.players.length;
        const currentPlayer = gameState.players.players[currentPlayerIndex];
        const timeRemaining = Math.max(0, gameState.timePerTurn - (Date.now() - gameState.startTime));
        const memoryWords = getMemoryWords(gameState.currentTurn);

        return (
            <div className={styles.gameBoard}>
                <div className={styles.header}>
                    <h2>Turno de {currentPlayer.name}</h2>
                    <div className={styles.timer}>{Math.ceil(timeRemaining / 1000)}s</div>
                </div>

                <div className={styles.cardDisplay}>
                    <div className={styles.currentCard}>
                        {gameState.currentCard.type === 'color' ? 
                            gameState.currentCard.value : 
                            gameState.currentCard.value}
                    </div>
                </div>

                <div className={styles.memorySection}>
                    <h3>Palabras a recordar:</h3>
                    <div className={styles.wordList}>
                        {memoryWords.map((word, index) => (
                            <div key={index} className={styles.wordItem}>
                                {word}
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.controls}>
                    <button
                        onClick={() => handlePlayerResponse(true, memoryWords)}
                        className={styles.correctButton}
                    >
                        Correcto
                    </button>
                    <button
                        onClick={() => handlePlayerResponse(false, [])}
                        className={styles.incorrectButton}
                    >
                        Incorrecto
                    </button>
                    <button
                        onClick={toggleAudio}
                        className={styles.audioButton}
                    >
                        {contextAudioEnabled ? 'Audio: 🔊' : 'Audio: 🔇'}
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className={styles.gameContainer}>
            {gameState.gameStarted ? renderGameBoard() : (
                <div className={styles.setupScreen}>
                    <h1>TUTTI FRUTTI MEMORY CARD</h1>
                    <div className={styles.setupInfo}>
                        <p>Meta de puntos: {gameState.maxScore}</p>
                        <p>Tiempo por turno: {gameState.timePerTurn / 1000}s</p>
                        <p>Jugadores: {gameState.players.players.length}</p>
                    </div>
                    <button 
                        onClick={() => {
                            setGameState(prev => ({
                                ...prev,
                                gameStarted: true,
                                startTime: Date.now(),
                                currentCard: getRandomCard(),
                                memoryWords: getMemoryWords(1)
                            }));
                            startNextTurn();
                        }}
                        className={styles.startButton}
                    >
                        Iniciar Juego
                    </button>
                </div>
            )}
        </div>
    );
}