"use client";

import type React from "react";
import { useEffect, useState } from "react";

interface AudioVisualizerProps {
    isPlaying: boolean;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isPlaying }) => {
    const [heights, setHeights] = useState<number[]>([1, 1, 1, 1]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout | null = null;

        if (isPlaying) {
            intervalId = setInterval(() => {
                setHeights(() =>
                    Array(4)
                        .fill(0)
                        .map(() => Math.random() * 1.2 + 0.5) // Scale between 0.5x and 1.7x
                );
            }, 100);
        } else {
            setHeights([1, 1, 1, 1]); // Reset to small circles when stopped
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [isPlaying]);

    return (
        <div className="flex items-center justify-center space-x-2 h-12 w-24 md:h-16 md:w-32">
            {heights.map((scale, index) => (
                <div
                    key={index}
                    className="w-3 bg-gray-500 transition-all duration-150 ease-in-out"
                    style={{
                        height: isPlaying ? `${scale * 20}px` : "8px", // Bigger minimum height for mobile
                        width: isPlaying ? "5px" : "8px", // Slightly larger width for visibility
                        borderRadius: isPlaying ? "4px" : "50%", // Circles when idle
                        transform: isPlaying ? `scaleY(${scale})` : "none", // Scale animation only when playing
                        minHeight: "8px", // Ensures visibility on small screens
                        willChange: "transform", // Optimizes rendering on mobile
                    }}
                />
            ))}
        </div>
    );
};

export default AudioVisualizer;
