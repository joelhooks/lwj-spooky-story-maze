import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import Image from "next/image";

import { NodeGenerationSchema } from "@/schemas";

import { mockCharacters } from "@/data/characters/characters";
import { generateNodeContent, NodeContent } from "@/lib/node";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../../convex/_generated/api";
import { notFound } from "next/navigation";

export default async function MazeNodePage({
  params,
  searchParams,
}: {
  params: { mazeId: string; nodeId: string };
  searchParams: { characterId: string | undefined };
}) {
  const maze = await fetchQuery(api.mazes.get, { id: params.mazeId });
  const nodeVisits = await fetchQuery(api.nodeVisit.getForNodeId, {
    nodeId: params.nodeId,
  });

  if (!maze) {
    notFound();
  }

  const currentNode = NodeGenerationSchema.parse(
    maze.nodes.find((node) => node.id === params.nodeId),
  );

  const character = mockCharacters.find(
    (character) => character.id === searchParams.characterId,
  );

  const nodeDetailsLoader = generateNodeContent(
    currentNode,
    nodeVisits,
    maze.overallDifficulty,
  );

  const connectedNodes = maze.edges
    .filter((edge) => edge.sourceId === currentNode.id)
    .map((edge) => maze.nodes.find((node) => node?.id === edge.targetId))
    .filter((item) => item !== undefined);

  const returnNode = maze.nodes.find(
    (node) =>
      node.id ===
      maze.edges.find((edge) => edge.targetId === currentNode.id)?.sourceId,
  );

  return character ? (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-6">{maze.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>{currentNode.name}</span>
            </CardTitle>
          </CardHeader>
          <Suspense
            fallback={
              <div className="bg-gray-800 p-4 rounded-lg mb-4 aspect-[16/9] relative" />
            }
          >
            <NodeImage nodeDetailsLoader={nodeDetailsLoader} />
          </Suspense>
          <Suspense
            fallback={
              <CardContent className="space-y-4">
                <ScrollArea className="h-40 border rounded-md p-4" />
              </CardContent>
            }
          >
            <NodeDescription nodeDetailsLoader={nodeDetailsLoader} />
          </Suspense>
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
                    alt={character.name}
                  />
                  <AvatarFallback>{character.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold">{character.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {character.class}
                  </p>
                </div>
              </div>
              <Progress
                value={(character.health / character.maxHealth) * 100}
                className="w-full"
              />
              <p>
                Health: {character.health}/{character.maxHealth}
              </p>

              <div>
                <p className="font-semibold">Inventory:</p>
                <ul className="list-disc list-inside">
                  {character.inventory.map((item, index) => (
                    <li key={index} className="text-sm">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-semibold">Navigate to:</p>
                <div className="space-y-2">
                  {connectedNodes.map((node) =>
                    node ? (
                      <Link
                        key={node.id}
                        href={`/maze/${maze.id}/${node.id}?characterId=${character.id}`}
                      >
                        <Button
                          key={node.id}
                          className="w-full justify-between bg-gray-700 hover:bg-gray-600 text-left"
                        >
                          <span>{node.name}</span>
                          <ArrowRight className="ml-2" size={18} />
                        </Button>
                      </Link>
                    ) : null,
                  )}
                  {returnNode ? (
                    <Link
                      href={`/maze/${maze.id}/${returnNode.id}?characterId=${character.id}`}
                    >
                      <Button className="w-full justify-between bg-gray-700 hover:bg-gray-600 text-left">
                        <span>{returnNode.name}</span>
                        <ArrowLeft className="ml-2" size={18} />
                      </Button>
                    </Link>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>
          Maze ID: {params.mazeId} | Node ID: {params.nodeId} | Theme:{" "}
          {maze.theme} | Scariness Level: {maze.overallDifficulty}
        </p>
      </div>
    </div>
  ) : null;
}

async function NodeImage({
  nodeDetailsLoader,
}: {
  nodeDetailsLoader: Promise<NodeContent & { nodeImageUrl: string }>;
}) {
  const nodeDetails = await nodeDetailsLoader;
  return nodeDetails.nodeImageUrl ? (
    <div className="bg-gray-800 p-4 rounded-lg mb-4 aspect-[16/9] relative">
      <Image
        src={nodeDetails.nodeImageUrl}
        alt="ASCII Art"
        fill={true}
        style={{ objectFit: "contain" }}
      />
    </div>
  ) : null;
}
async function NodeDescription({
  nodeDetailsLoader,
}: {
  nodeDetailsLoader: Promise<NodeContent>;
}) {
  const nodeDetails = await nodeDetailsLoader;
  return (
    <CardContent className="space-y-4">
      <ScrollArea className="h-40 border rounded-md p-4">
        <p>{nodeDetails.description}</p>
      </ScrollArea>
    </CardContent>
  );
}
