import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Loader2 } from "lucide-react";

import { getCharacterSheet } from "@/lib/character";
import { getCachedGenerateMaze } from "@/lib/maze";
import { Suspense, use } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { revalidatePath } from "next/cache";
import LoadingMessage from "../../_components/loading-message";
import Image from "next/image";
// Add this server action at the top of the file, outside of any component
async function handleAction(formData: FormData) {
  "use server";

  const actionId = formData.get("actionId");
  // Here you would typically update the game state based on the action
  console.log(`Action ${actionId} selected`);

  // Revalidate the current page to reflect any changes
  revalidatePath("/maze/[mazeId]/play");
}

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
        <MazePlaying
          mazeId={mazeId}
          theme={theme}
          scarinessLevel={scarinessLevel}
          mazeLoader={mazeLoader}
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

async function MazePlaying({
  mazeId,
  theme,
  scarinessLevel,
  mazeLoader,
}: {
  mazeId: string;
  theme: string;
  scarinessLevel: number;
  mazeLoader: Promise<any>;
}) {
  const maze = await mazeLoader;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-6">{maze.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Current Scene</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
              {" "}
              {/* 16:9 aspect ratio */}
              <Image
                src="/placeholder.svg?height=720&width=1280"
                alt="Current scene"
                layout="fill"
                objectFit="cover"
                className="rounded-md"
              />
            </div>
            <ScrollArea className="h-40">
              <p>{mockMazeData.description}</p>
            </ScrollArea>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Character Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage
                    src="/placeholder.svg?height=64&width=64"
                    alt={mockCharacterData.name}
                  />
                  <AvatarFallback>{mockCharacterData.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold">{mockCharacterData.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {mockCharacterData.class}
                  </p>
                </div>
              </div>
              <div>
                <p>Health: {mockCharacterData.health}</p>
                <p>Inventory:</p>
                <ul className="list-disc list-inside">
                  {mockCharacterData.inventory.map((item, index) => (
                    <li key={index} className="text-sm">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mini-Map</CardTitle>
            </CardHeader>
            <CardContent>
              <MiniMap map={mockMazeData.miniMap} />
            </CardContent>
          </Card>
        </div>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={handleAction}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mockMazeData.actions.map((action) => (
                  <Button
                    key={action.id}
                    type="submit"
                    name="actionId"
                    value={action.id}
                    variant="outline"
                    className="w-full text-left justify-start"
                  >
                    {action.text}
                  </Button>
                ))}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>
          Maze ID: {mazeId} | Intensity Level: {scarinessLevel}/10
        </p>
      </div>
    </div>
  );
}

const mockMazeData = {
  description:
    "You find yourself in a dimly lit room. The air is thick with an eerie silence, broken only by the faint sound of dripping water. Shadows dance on the walls, cast by flickering candles scattered around the room. To your left, you see a rusty door with strange symbols etched into its surface. To your right, a narrow corridor stretches into darkness. Ahead, an old mirror reflects your uncertain expression.",
  actions: [
    { id: 1, text: "Examine the rusty door" },
    { id: 2, text: "Venture down the dark corridor" },
    { id: 3, text: "Look closely at the mirror" },
    { id: 4, text: "Search the room for clues" },
  ],
  miniMap: [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 2, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
  ],
};

const mockCharacterData = {
  name: "Alex",
  class: "Explorer",
  health: 100,
  inventory: ["Flashlight", "Old Key", "Mysterious Amulet"],
};

function MiniMap({ map }: { map: number[][] }) {
  return (
    <div className="grid grid-cols-5 gap-1 w-full aspect-square">
      {map.flat().map((cell, index) => (
        <div
          key={index}
          className={`
            w-full aspect-square rounded-sm
            ${cell === 0 ? "bg-gray-700" : cell === 1 ? "bg-gray-500" : "bg-blue-500"}
          `}
        />
      ))}
    </div>
  );
}
