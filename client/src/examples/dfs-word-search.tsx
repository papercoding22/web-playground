import React, { useState, useEffect } from "react";

const directions = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

interface WordSearchVisualizerProps {
  board: string[][];
  word: string;
}

const WordSearchVisualizer: React.FC<WordSearchVisualizerProps> = ({
  board,
  word,
}) => {
  const [visited, setVisited] = useState<boolean[][]>([]);
  const [visiting, setVisiting] = useState<[number, number][]>([]);
  const [found, setFound] = useState(false);

  useEffect(() => {
    setVisited(
      Array(board.length)
        .fill(null)
        .map(() => Array(board[0].length).fill(false))
    );
    setVisiting([]);
    setFound(false);
  }, [board, word]);

  const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

  const isValid = (i: number, j: number, visited: boolean[][]) => {
    return (
      i >= 0 &&
      i < board.length &&
      j >= 0 &&
      j < board[0].length &&
      !visited[i][j]
    );
  };

  const dfs = async (
    i: number,
    j: number,
    wordIndex: number,
    visitedCopy: boolean[][]
  ): Promise<boolean> => {
    if (wordIndex === word.length) return true;

    if (i >= 0 && i < board.length && j >= 0 && j < board[0].length) {
      setVisiting([[i, j]]);
      await sleep(750);
    }

    if (!isValid(i, j, visitedCopy) || board[i][j] !== word[wordIndex]) {
      setVisiting([]);
      await sleep(750);
      return false;
    }

    visitedCopy[i][j] = true;
    setVisited((prev) => {
      const newV = prev.map((row) => [...row]);
      newV[i][j] = true;
      return newV;
    });

    for (const [di, dj] of directions) {
      const ni = i + di;
      const nj = j + dj;
      if (await dfs(ni, nj, wordIndex + 1, visitedCopy)) {
        setVisiting([]);
        return true;
      }
    }

    visitedCopy[i][j] = false;
    setVisiting([]);
    setVisited((prev) => {
      const newV = prev.map((row) => [...row]);
      newV[i][j] = false;
      return newV;
    });
    await sleep(750);
    return false;
  };

  const startSearch = async () => {
    const visited = Array(board.length)
      .fill(null)
      .map(() => Array(board[0].length).fill(false));

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[0].length; j++) {
        if (await dfs(i, j, 0, visited)) {
          setFound(true);
          return;
        }
      }
    }
    alert("Word not found!");
  };

  const onReset = () => {
    setVisited(
      Array(board.length)
        .fill(null)
        .map(() => Array(board[0].length).fill(false))
    );
    setVisiting([]);
    setFound(false);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>DFS Word Search: {word}</h1>
      <div
        style={{
          ...styles.grid,
          gridTemplateColumns: `repeat(${board[0]?.length || 0}, 40px)`,
        }}
      >
        {board.map((row, i) =>
          row.map((char, j) => {
            const isVisiting = visiting.some(
              ([vi, vj]) => vi === i && vj === j
            );
            const isVisited = visited[i]?.[j];
            let backgroundColor = "#fff";
            if (isVisiting) backgroundColor = "lightgreen";
            else if (isVisited) backgroundColor = "#FADA7A";
            return (
              <div
                key={`${i}-${j}`}
                style={{
                  ...styles.cell,
                  backgroundColor,
                }}
              >
                {char}
              </div>
            );
          })
        )}
      </div>
      <button onClick={startSearch} style={styles.button}>
        Start DFS Search
      </button>
      {/* Reset button */}
      <button onClick={onReset} style={styles.button}>
        Reset
      </button>
      {found && <p style={styles.success}>Word Found!</p>}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3674B5",
    color: "#fff",
    padding: "20px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  grid: {
    display: "grid",
    gap: "4px",
    marginBottom: "16px",
  },
  cell: {
    width: "40px",
    height: "40px",
    border: "1px solid #999",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "18px",
    fontWeight: "bold",
    color: "black",
  },
  button: {
    backgroundColor: "#fff",
    color: "#000",
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    marginBottom: "16px",
  },
  success: {
    color: "lightgreen",
    marginTop: "10px",
    fontWeight: "bold",
  },
};

export default WordSearchVisualizer;
