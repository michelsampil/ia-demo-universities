import React, { useEffect, useState } from "react";
import styled from "styled-components";

interface ChessboardRevealProps {
  imageUrl: string;
  rows?: number;
  cols?: number;
}

const ImageContainer = styled.div<{ rows: number; cols: number }>`
  position: relative;
  width: 500px;
  height: 500px;
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
  filter: blur(10px);
  transition: filter 0.5s ease;
`;

const ChessboardReveal: React.FC<ChessboardRevealProps> = ({
  imageUrl,
  rows = 8,
  cols = 8,
}) => {
  const totalSquares = rows * cols;
  const [revealedSquares, setRevealedSquares] = useState<number[]>([]);

  useEffect(() => {
    const squareIndices = Array.from(
      { length: totalSquares },
      (_, index) => index
    );

    const revealRandomSquare = () => {
      if (squareIndices.length > 0) {
        const randomIndex = Math.floor(Math.random() * squareIndices.length);
        const squareIndex = squareIndices.splice(randomIndex, 1)[0];
        setRevealedSquares((prev) => [...prev, squareIndex]);
        setTimeout(revealRandomSquare, 200); // Delay between reveals
      }
    };

    setTimeout(revealRandomSquare, 1000); // Start revealing after 1 second
  }, [totalSquares]);

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
