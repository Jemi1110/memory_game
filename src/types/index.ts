export interface Player {
    id: string;
    name: string;
    score: number;
    consecutiveCorrect: number;
    turnOrder: number;
}

export interface Players {
    players: Player[];
    currentTurn: number;
}

export interface Card {
    id: number;
    type: 'color' | 'letter';
    value: string;
    revealed: boolean;
    matched: boolean;
}

export interface GameState {
    players: {
        players: Player[];
        currentTurn: number;
    };
    currentTurn: number;
    startTime: number;
    maxScore: number;
    timePerTurn: number;
    currentCard: Card;
    memoryWords: string[];
    gameStarted: boolean;
    gameEnded: boolean;
    consecutiveCorrect: number;
}

