import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Word Finder Game Types
export type WordDirection = 'horizontal' | 'vertical' | 'diagonal' | 'diagonal-reverse' | 'horizontal-reverse' | 'vertical-reverse';

export type GridCell = {
  letter: string;
  row: number;
  col: number;
  isFound: boolean;
  isHighlighted: boolean;
  wordIds: string[];
};

export type WordPlacement = {
  id: string;
  word: string;
  startRow: number;
  startCol: number;
  direction: WordDirection;
  isFound: boolean;
};

export type GameLevel = {
  level: number;
  words: string[];
  allowedDirections: WordDirection[];
  gridSize: number;
  maxWordLength: number;
  minWordLength: number;
};

export type GameState = {
  currentLevel: number;
  grid: GridCell[][];
  words: WordPlacement[];
  wordsFound: number;
  totalWords: number;
  startTime: number;
  isComplete: boolean;
  levelComplete: boolean;
};

export type GameStats = {
  level: number;
  timeElapsed: number;
  accuracy: number;
  wordsFound: number;
  totalWords: number;
};

// NPAT Game Types
export type NPATCategory = 'name' | 'place' | 'animal' | 'thing';

export type NPATAnswer = {
  category: NPATCategory;
  value: string;
  isValid: boolean;
  points: number;
  isDuplicate: boolean;
};

export type NPATRound = {
  roundNumber: number;
  letter: string;
  answers: Record<NPATCategory, NPATAnswer>;
  score: number;
  isComplete: boolean;
  timeRemaining: number;
  isPerfectRound: boolean;
};

export type NPATGameState = {
  gameId: string;
  isMultiplayer: boolean;
  currentRound: number;
  totalRounds: number;
  timeLimit: number; // 15, 30, or 45 seconds
  rounds: NPATRound[];
  totalScore: number;
  usedLetters: string[];
  usedAnswers: Record<NPATCategory, string[]>;
  isGameComplete: boolean;
  currentLetter: string | null;
  startTime: number;
};

export type NPATPlayer = {
  id: string;
  name: string;
  score: number;
  currentAnswers: Record<NPATCategory, string>;
  isReady: boolean;
};

export type NPATGameRoom = {
  roomId: string;
  hostId: string;
  players: NPATPlayer[];
  gameState: NPATGameState;
  isGameStarted: boolean;
  settings: {
    timeLimit: number;
    totalRounds: number;
  };
};
