import * as React from "react";

import { NodeContent } from "@/lib/maze";
import Image from "next/image";

export default function GameInterface({
  nodeContent,
}: {
  nodeContent?: NodeContent & { asciiArtUrl: string };
}) {
  console.log({ nodeContent });
  return (
    <div className="min-h-screen bg-purple-900 text-gray-300 font-serif p-4 flex flex-col">
      <div className="flex flex-col lg:flex-row flex-grow">
        {/* Main Content Area */}
        <div className="lg:w-3/5 pr-4 mb-4 lg:mb-0">
          {/* ASCII Art */}
          <div className="bg-gray-800 p-4 rounded-lg mb-4 aspect-[16/9] relative">
            {nodeContent?.asciiArtUrl && (
              <Image
                src={nodeContent.asciiArtUrl}
                alt="ASCII Art"
                fill={true}
                style={{ objectFit: "contain" }}
              />
            )}
          </div>
          {/* Room Description */}
          <div className="bg-gray-800 p-4 rounded-lg mb-4 h-40 overflow-y-auto custom-scrollbar">
            <p className="font-mono text-sm leading-relaxed">
              {nodeContent?.description}
            </p>
          </div>
          {/* User Choices */}
          <div className="flex space-x-2 mb-4">
            {nodeContent?.availableActions.map((action, index) => (
              <button
                key={index}
                className="flex-1 bg-yellow-900 text-yellow-100 p-2 rounded shadow-inner border border-yellow-800 hover:bg-yellow-800 transition"
              >
                {action}
              </button>
            ))}
          </div>
          {/* Command Input */}
          {/* <form onSubmit={handleCommandSubmit} className="relative">
            <input
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              className="w-full bg-yellow-100/20 border-2 border-yellow-900/50 rounded p-2 pr-10 text-yellow-100 placeholder-yellow-100/50"
              placeholder="Enter your command..."
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              <Bell className="w-6 h-6 text-yellow-900" />
            </button>
          </form> */}
        </div>

        {/* Sidebar */}
        <div className="lg:w-2/5 lg:pl-4">
          {/* Map */}
          <div className="bg-yellow-900/30 p-4 rounded-lg mb-4 h-64 overflow-hidden">
            <div className="grid grid-cols-5 gap-1 h-full">
              {[...Array(25)].map((_, i) => (
                <div
                  key={i}
                  className={`border ${
                    i === 12
                      ? "bg-blue-300/20 border-blue-300"
                      : "border-yellow-800/50"
                  } rounded-sm`}
                ></div>
              ))}
            </div>
          </div>
          {/* Inventory */}
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <h3 className="text-lg mb-2 text-blue-300">Inventory</h3>
            <ul className="grid grid-cols-3 gap-2">
              {["Rusty Key", "Old Book", "Candle"].map((item, i) => (
                <li key={i} className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-blue-300/20 rounded-full flex items-center justify-center mb-1">
                    <span className="text-2xl">{item[0]}</span>
                  </div>
                  <span className="text-xs text-center">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 bg-gray-800 p-2 rounded-lg flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-20 bg-red-900/50 rounded-full h-2">
            <div className="bg-red-500 w-3/4 h-full rounded-full"></div>
          </div>
          <span className="text-sm">Health: 75%</span>
        </div>
        <div className="text-sm text-blue-300">
          Hint: Look closely at the artifacts...
        </div>
        {/* <button
          onClick={() => setIsMuted(!isMuted)}
          className="text-gray-400 hover:text-gray-300"
        >
          {isMuted ? (
            <VolumeX className="w-6 h-6" />
          ) : (
            <Volume2 className="w-6 h-6" />
          )}
        </button> */}
      </div>

      {/* Atmospheric Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-purple-900/20"></div>
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white/10 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              animation: `float ${Math.random() * 10 + 5}s linear infinite`,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}
