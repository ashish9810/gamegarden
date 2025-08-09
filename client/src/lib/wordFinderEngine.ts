import type { GameLevel, GameState, GridCell, WordPlacement, WordDirection } from '@shared/schema';

// Word lists for each level with progressive difficulty
export const LEVEL_CONFIGURATIONS: GameLevel[] = [
  {
    level: 1,
    words: ['CAT', 'DOG', 'SUN', 'TREE', 'BOOK', 'RAIN'],
    allowedDirections: ['horizontal', 'vertical'],
    gridSize: 12,
    maxWordLength: 4,
    minWordLength: 3
  },
  {
    level: 2,
    words: ['HOUSE', 'WATER', 'LIGHT', 'MOUSE', 'PHONE', 'MUSIC'],
    allowedDirections: ['horizontal', 'vertical', 'diagonal'],
    gridSize: 12,
    maxWordLength: 5,
    minWordLength: 4
  },
  {
    level: 3,
    words: ['FRIEND', 'GARDEN', 'CASTLE', 'BRIDGE', 'FOREST', 'ISLAND'],
    allowedDirections: ['horizontal', 'vertical', 'diagonal', 'horizontal-reverse', 'vertical-reverse'],
    gridSize: 12,
    maxWordLength: 6,
    minWordLength: 5
  },
  {
    level: 4,
    words: ['JOURNEY', 'MYSTERY', 'CHAPTER', 'KITCHEN', 'WEATHER', 'PICTURE'],
    allowedDirections: ['horizontal', 'vertical', 'diagonal', 'horizontal-reverse', 'vertical-reverse', 'diagonal-reverse'],
    gridSize: 12,
    maxWordLength: 7,
    minWordLength: 6
  },
  {
    level: 5,
    words: ['ADVENTURE', 'BRILLIANT', 'CHALLENGE', 'DISCOVERY', 'EDUCATION', 'FANTASTIC'],
    allowedDirections: ['horizontal', 'vertical', 'diagonal', 'horizontal-reverse', 'vertical-reverse', 'diagonal-reverse'],
    gridSize: 12,
    maxWordLength: 9,
    minWordLength: 8
  }
];

export class WordFinderEngine {
  private generateEmptyGrid(size: number): GridCell[][] {
    return Array(size).fill(null).map((_, row) =>
      Array(size).fill(null).map((_, col) => ({
        letter: '',
        row,
        col,
        isFound: false,
        isHighlighted: false,
        wordIds: []
      }))
    );
  }

  private getDirectionDeltas(direction: WordDirection): { rowDelta: number; colDelta: number } {
    const deltas = {
      'horizontal': { rowDelta: 0, colDelta: 1 },
      'vertical': { rowDelta: 1, colDelta: 0 },
      'diagonal': { rowDelta: 1, colDelta: 1 },
      'horizontal-reverse': { rowDelta: 0, colDelta: -1 },
      'vertical-reverse': { rowDelta: -1, colDelta: 0 },
      'diagonal-reverse': { rowDelta: -1, colDelta: -1 }
    };
    return deltas[direction];
  }

  private canPlaceWord(grid: GridCell[][], word: string, startRow: number, startCol: number, direction: WordDirection): boolean {
    const { rowDelta, colDelta } = this.getDirectionDeltas(direction);
    const gridSize = grid.length;

    for (let i = 0; i < word.length; i++) {
      const row = startRow + (rowDelta * i);
      const col = startCol + (colDelta * i);

      if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) {
        return false;
      }

      const cell = grid[row][col];
      if (cell.letter !== '' && cell.letter !== word[i]) {
        return false;
      }
    }
    return true;
  }

  private placeWord(grid: GridCell[][], word: string, startRow: number, startCol: number, direction: WordDirection, wordId: string): void {
    const { rowDelta, colDelta } = this.getDirectionDeltas(direction);

    for (let i = 0; i < word.length; i++) {
      const row = startRow + (rowDelta * i);
      const col = startCol + (colDelta * i);
      const cell = grid[row][col];
      
      cell.letter = word[i];
      cell.wordIds.push(wordId);
    }
  }

  private fillEmptyCells(grid: GridCell[][]): void {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        if (grid[row][col].letter === '') {
          grid[row][col].letter = letters[Math.floor(Math.random() * letters.length)];
        }
      }
    }
  }

  public generateLevel(levelConfig: GameLevel): { grid: GridCell[][], words: WordPlacement[] } {
    const grid = this.generateEmptyGrid(levelConfig.gridSize);
    const words: WordPlacement[] = [];
    const maxAttempts = 1000;

    // Try to place each word
    for (const word of levelConfig.words) {
      let placed = false;
      let attempts = 0;

      while (!placed && attempts < maxAttempts) {
        const direction = levelConfig.allowedDirections[Math.floor(Math.random() * levelConfig.allowedDirections.length)];
        const startRow = Math.floor(Math.random() * levelConfig.gridSize);
        const startCol = Math.floor(Math.random() * levelConfig.gridSize);
        const wordId = `${word}-${Date.now()}-${Math.random()}`;

        if (this.canPlaceWord(grid, word, startRow, startCol, direction)) {
          this.placeWord(grid, word, startRow, startCol, direction, wordId);
          words.push({
            id: wordId,
            word,
            startRow,
            startCol,
            direction,
            isFound: false
          });
          placed = true;
        }
        attempts++;
      }
    }

    this.fillEmptyCells(grid);
    return { grid, words };
  }

  public initializeGame(level: number): GameState {
    if (level < 1 || level > LEVEL_CONFIGURATIONS.length) {
      throw new Error(`Invalid level: ${level}`);
    }

    const levelConfig = LEVEL_CONFIGURATIONS[level - 1];
    const { grid, words } = this.generateLevel(levelConfig);

    return {
      currentLevel: level,
      grid,
      words,
      wordsFound: 0,
      totalWords: words.length,
      startTime: Date.now(),
      isComplete: false,
      levelComplete: false
    };
  }

  public checkWordSelection(gameState: GameState, selectedCells: { row: number; col: number }[]): { 
    wordFound: string | null; 
    newGameState: GameState;
    isLevelComplete: boolean;
  } {
    const newGameState = JSON.parse(JSON.stringify(gameState)) as GameState;
    
    // Create a string from selected cells
    const selectedLetters = selectedCells.map(cell => gameState.grid[cell.row][cell.col].letter).join('');
    
    // Check if selection matches any unfound word
    for (const word of newGameState.words) {
      if (word.isFound) continue;

      // Check forward direction
      const wordCells = this.getWordCells(word);
      if (this.arraysEqual(selectedCells, wordCells) || this.arraysEqual(selectedCells, wordCells.reverse())) {
        // Word found!
        word.isFound = true;
        newGameState.wordsFound++;
        
        // Mark cells as found
        wordCells.forEach(cell => {
          newGameState.grid[cell.row][cell.col].isFound = true;
        });

        const isLevelComplete = newGameState.wordsFound === newGameState.totalWords;
        if (isLevelComplete) {
          newGameState.levelComplete = true;
          if (newGameState.currentLevel === LEVEL_CONFIGURATIONS.length) {
            newGameState.isComplete = true;
          }
        }

        return {
          wordFound: word.word,
          newGameState,
          isLevelComplete
        };
      }
    }

    return {
      wordFound: null,
      newGameState,
      isLevelComplete: false
    };
  }

  private getWordCells(word: WordPlacement): { row: number; col: number }[] {
    const { rowDelta, colDelta } = this.getDirectionDeltas(word.direction);
    const cells = [];

    for (let i = 0; i < word.word.length; i++) {
      cells.push({
        row: word.startRow + (rowDelta * i),
        col: word.startCol + (colDelta * i)
      });
    }

    return cells;
  }

  private arraysEqual(arr1: { row: number; col: number }[], arr2: { row: number; col: number }[]): boolean {
    if (arr1.length !== arr2.length) return false;
    
    return arr1.every((cell1, index) => {
      const cell2 = arr2[index];
      return cell1.row === cell2.row && cell1.col === cell2.col;
    });
  }

  public calculateStats(gameState: GameState): { timeElapsed: number; accuracy: number } {
    const timeElapsed = Math.floor((Date.now() - gameState.startTime) / 1000);
    const accuracy = gameState.totalWords > 0 ? Math.round((gameState.wordsFound / gameState.totalWords) * 100) : 0;
    
    return { timeElapsed, accuracy };
  }
}