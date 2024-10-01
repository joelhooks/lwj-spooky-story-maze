"use client";

import * as React from "react";
import { useState, useEffect } from "react";

const loadingMessages = [
  "Generating maze layout...",
  "Placing obstacles...",
  "Creating pathways...",
  "Adding mysterious elements...",
  "Incorporating theme details...",
  "Adjusting difficulty...",
  "Finalizing maze structure...",
  "Preparing your adventure...",
  "Summoning ancient spirits...",
  "Hiding secret passages...",
  "Planting magical artifacts...",
  "Enchanting the walls...",
  "Scattering clues...",
  "Awakening guardian creatures...",
  "Weaving illusions...",
  "Calibrating time distortions...",
  "Infusing elemental energies...",
  "Aligning celestial patterns...",
  "Whispering riddles to the wind...",
  "Polishing the final touches...",
  "Conjuring mystical fog...",
  "Planting enchanted flora...",
  "Carving ancient runes...",
  "Summoning spectral guides...",
  "Weaving temporal anomalies...",
  "Infusing shadows with life...",
  "Crafting illusory dead ends...",
  "Seeding crystalline formations...",
  "Invoking elemental guardians...",
  "Scattering echoes of the past...",
];

export default function LoadingMessage() {
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
  const [unusedMessages, setUnusedMessages] = useState([...loadingMessages]);

  useEffect(() => {
    const messageIntervalId = setInterval(() => {
      setUnusedMessages((prevUnusedMessages) => {
        if (prevUnusedMessages.length === 0) {
          // If all messages have been used, reset the array
          return [...loadingMessages];
        }

        const randomIndex = Math.floor(
          Math.random() * prevUnusedMessages.length,
        );
        const selectedMessage = prevUnusedMessages[randomIndex];
        setLoadingMessage(selectedMessage);

        // Remove the selected message from the unused messages
        return prevUnusedMessages.filter((_, index) => index !== randomIndex);
      });
    }, 3000);

    return () => clearInterval(messageIntervalId);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse"
          style={{
            animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          }}
        />
      </div>
      <div className="mt-4 text-center">
        <p className="text-sm italic">{loadingMessage}</p>
      </div>
    </div>
  );
}
