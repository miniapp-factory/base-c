"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Share } from "@/components/share";
import { url } from "@/lib/metadata";

const fruits = ["Apple", "Banana", "Cherry", "Lemon"];

function getRandomFruit() {
  return fruits[Math.floor(Math.random() * fruits.length)];
}

export default function SlotMachine() {
  const [grid, setGrid] = useState<string[][]>(
    Array.from({ length: 3 }, () => Array.from({ length: 3 }, getRandomFruit))
  );
  const [spinning, setSpinning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startSpin = () => {
    if (spinning) return;
    setSpinning(true);
    intervalRef.current = setInterval(() => {
      setGrid((prev) => {
        const newGrid = prev.map((row) => [...row]);
        // shift rows down
        for (let col = 0; col < 3; col++) {
          for (let row = 2; row > 0; row--) {
            newGrid[row][col] = newGrid[row - 1][col];
          }
          newGrid[0][col] = getRandomFruit();
        }
        return newGrid;
      });
    }, 100);
    setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setSpinning(false);
    }, 2000);
  };

  // win detection directly in JSX
  const hasWon = () => {
    // rows
    for (let r = 0; r < 3; r++) {
      if (grid[r][0] === grid[r][1] && grid[r][1] === grid[r][2]) return true;
    }
    // columns
    for (let c = 0; c < 3; c++) {
      if (grid[0][c] === grid[1][c] && grid[1][c] === grid[2][c]) return true;
    }
    return false;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-3 gap-2">
        {grid.flat().map((fruit, idx) => (
          <div key={idx} className="w-16 h-16 flex items-center justify-center border rounded">
            <img src={`/${fruit.toLowerCase()}.png`} alt={fruit} className="w-12 h-12" />
          </div>
        ))}
      </div>
      <Button onClick={startSpin} disabled={spinning} variant="outline">
        {spinning ? "Spinning..." : "Spin"}
      </Button>
      {!spinning && hasWon() && (
        <div className="mt-4 flex flex-col items-center gap-2">
          <span className="text-xl font-bold text-green-600">You Win!</span>
          <Share text={`I just won with the slot machine! ${url}`} />
        </div>
      )}
    </div>
  );
}
