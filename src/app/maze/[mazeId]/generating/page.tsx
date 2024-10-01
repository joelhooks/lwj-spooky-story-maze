import { Card, CardContent } from "@/components/ui/card";
import { fetchMutation } from "convex/nextjs";

import { Loader2 } from "lucide-react";

import { getCharacterSheet } from "@/lib/character";
import { getCachedGenerateMaze } from "@/lib/maze";
import { Suspense } from "react";
import LoadingMessage from "../../_components/loading-message";
import { redirect } from "next/navigation";
import { api } from "../../../../../convex/_generated/api";

export default async function MazeLoadingPage({
  params,
  searchParams,
}: {
  params: { mazeId: string };
  searchParams: { [key: string]: string | undefined };
}) {
  const mazeId = params.mazeId;
  const characterId = searchParams.characterId || "default";
  const theme = searchParams.theme || "Unknown";
  const scarinessLevel = parseInt(searchParams.scarinessLevel || "5", 10);
  const characterSheet = await getCharacterSheet(characterId);

  const mazeLoader = getCachedGenerateMaze(
    theme,
    scarinessLevel,
    characterSheet,
  );

  return (
    <div className="container mx-auto p-4 h-screen flex items-center justify-center bg-background">
      <Suspense
        fallback={
          <MazeLoadingCard
            characterId={characterId}
            mazeId={mazeId}
            theme={theme}
            scarinessLevel={scarinessLevel}
          />
        }
      >
        <MazeLoaded
          characterId={characterId}
          mazeLoader={mazeLoader}
          scarinessLevel={scarinessLevel}
        />
      </Suspense>
    </div>
  );
}

async function MazeLoadingCard({
  characterId,
  mazeId,
  theme,
  scarinessLevel,
}: {
  characterId: string;
  mazeId: string;
  theme: string;
  scarinessLevel: number;
}) {
  return (
    <Card className="w-full max-w-md border-muted">
      <CardContent className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Maze Generation</h2>
          <Loader2 className="animate-spin" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Character ID:</span>
            <span className="font-mono">{characterId}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Maze ID:</span>
            <span className="font-mono">{mazeId}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Theme:</span>
            <span>{decodeURIComponent(theme)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Intensity Level:</span>
            <span>{scarinessLevel}/10</span>
          </div>
        </div>

        <LoadingMessage />

        <div className="text-center text-xs text-muted-foreground">
          Prepare yourself for an immersive adventure...
        </div>
      </CardContent>
    </Card>
  );
}

async function MazeLoaded({
  mazeLoader,
  characterId,
  scarinessLevel,
}: {
  mazeLoader: Promise<any>;
  characterId: string;
  scarinessLevel: number;
}) {
  const maze = await mazeLoader;

  await fetchMutation(api.mazes.createMaze, {
    maze: {
      ...maze,
      overallDifficulty: scarinessLevel,
    },
  });

  if (maze) {
    const firstNode = maze.nodes[0];
    redirect(`/maze/${maze.id}/${firstNode.id}/?characterId=${characterId}`);
  }

  return null;
}
