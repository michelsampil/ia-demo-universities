import React, { useEffect, useState } from "react";
import styled from "styled-components";

interface ChessboardRevealProps {
  imageUrl: string;
  rows?: number;
  cols?: number;
}

const ImageContainer = styled.div<{ rows: number; cols: number }>`
  position: relative;
  width: 82vmin;
  height: 82vmin;
  display: grid;
  grid-template-columns: repeat(${(props) => props.cols}, 1fr);
  grid-template-rows: repeat(${(props) => props.rows}, 1fr);
`;

const Square = styled.div<{
  bgPosition: string;
  imageUrl: string;
  rows: number;
  cols: number;
}>`
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(${(props) => props.imageUrl});
  background-size: ${(props) => props.cols * 100}%
    ${(props) => props.rows * 100}%;
  background-position: ${(props) => props.bgPosition};
  filter: blur(50px);
  transition: filter 0.5s ease;
`;

const ChessboardReveal: React.FC<ChessboardRevealProps> = ({
  imageUrl,
  rows = 8,
  cols = 8,
}) => {
  const totalSquares = rows * cols;
  const [revealedSquares, setRevealedSquares] = useState<number[]>([]);
  const [revealMode, setRevealMode] = useState<
    "random" | "linear" | "diagonal"
  >("random");

  useEffect(() => {
    // Randomly select a reveal mode for this component instance
    const modes: ("random" | "linear" | "diagonal")[] = [
      "random",
      "linear",
      "diagonal",
    ];
    setRevealMode(modes[Math.floor(Math.random() * modes.length)]);

    const squareIndices = Array.from(
      { length: totalSquares },
      (_, index) => index
    );

    const revealSquare = (index: number) => {
      setRevealedSquares((prev) => [...prev, index]);
    };

    const revealRandomSquares = () => {
      if (squareIndices.length > 0) {
        const randomIndex = Math.floor(Math.random() * squareIndices.length);
        const squareIndex = squareIndices.splice(randomIndex, 1)[0];
        revealSquare(squareIndex);
        setTimeout(revealRandomSquares, 200); // Delay between reveals
      }
    };

    const revealLinearSquares = () => {
      let index = 0;
      const interval = setInterval(() => {
        if (index < totalSquares) {
          revealSquare(index);
          index++;
        } else {
          clearInterval(interval);
        }
      }, 200); // Delay between reveals
    };

    const revealDiagonalSquares = () => {
      for (let d = 0; d < rows + cols - 1; d++) {
        for (
          let row = Math.max(0, d - cols + 1);
          row <= Math.min(rows - 1, d);
          row++
        ) {
          const col = d - row;
          const index = row * cols + col;
          setTimeout(() => revealSquare(index), d * 200); // Delay based on diagonal distance
        }
      }
    };

    // Clear previous reveals
    setRevealedSquares([]);

    switch (revealMode) {
      case "linear":
        revealLinearSquares();
        break;
      case "diagonal":
        revealDiagonalSquares();
        break;
      case "random":
      default:
        setTimeout(revealRandomSquares, 1000); // Start revealing after 1 second
        break;
    }
  }, [totalSquares, revealMode, imageUrl]);

  return (
    <ImageContainer rows={rows} cols={cols}>
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: cols }).map((_, col) => {
          const squareIndex = row * cols + col;
          const isRevealed = revealedSquares.includes(squareIndex);
          return (
            <Square
              key={`${row}-${col}`}
              bgPosition={`${(col / (cols - 1)) * 100}% ${
                (row / (rows - 1)) * 100
              }%`}
              imageUrl={imageUrl}
              rows={rows}
              cols={cols}
              style={{ filter: isRevealed ? "blur(0)" : "blur(10px)" }}
            />
          );
        })
      )}
    </ImageContainer>
  );
};

export default ChessboardReveal;
