"use server";

import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import "server-only";

import { MazeGenerationSchema, CharacterSchema } from "@/schemas";
import { replaceWithValidGuids } from "@/utils";
import { z } from "zod";
import { unstable_cache } from "next/cache";

export const getCachedGenerateMaze = unstable_cache(
  async (
    theme: string,
    scarrinessLevel: number,
    characterSheet: z.infer<typeof CharacterSchema> | null,
  ) => generateMaze(theme, scarrinessLevel, characterSheet),
  ["mazes"],
  { revalidate: 3600 },
);

export const generateMaze = async (
  theme: string,
  scarrinessLevel: number,
  characterSheet: z.infer<typeof CharacterSchema> | null,
) => {
  const result = await generateObject({
    model: openai("gpt-4o-2024-08-06", {
      structuredOutputs: true,
    }),
    temperature: 1,
    schemaName: "maze",
    schemaDescription: "A maze structure for a text-based adventure game.",
    schema: MazeGenerationSchema,
    system: `You are creating a maze structure for a text-based adventure game. Your task is to generate prompts that will be used to create the actual game content. 
    
    Important:
    1. Create prompts that will generate appropriate content for each node and transition.
    2. Do not mention LLMs or AI in the prompts.
    3. Consider the character sheet when creating the prompts.
    4. Each prompt should be designed to elicit specific, atmospheric, and thematic responses.
    5. The theme is ${theme}.
    6. the scarriness level should be ${scarrinessLevel} on a scale of 1 to 10.
    7. respect the scarriness level when creating the prompts. from a little shiver to "this gave me fucking nightmares omg"`,
    prompt: `Create a maze structure with the following requirements:
    1. Generate 5-7 nodes, including a start node, several room nodes, and a boss node.
    2. For each node, create an 'initialVisitPrompt' that will be instructions for an AI to generate the room, potential encounters, and atmosphere
    2. For each node, create an 'initialVisitImagePrompt' that will provide instructions for an AI image generator to create an image of the scene. Keep it simple, brief, with only important details.
    3. Also create a 'returnVisitPrompt' for each node that will be instructions for an AI that incorporates the user's previous experiences when they revisit a room.
    4. Create edges connecting these nodes, with transition descriptions that will be instructions for an AI to describe the movement between rooms.
    5. All IDs should be GUIDs.
    6. The maze should have a very descriptive name based on the theme
    7. The maze name should reflect the scarriness level and be a good descriptor of what the maze will contain
    8. The node names are evocative af but not too long.
    
    Remember, write the prompts as if they were instructions for an AI generating the game content not the game content itself.
    
    Character: ${JSON.stringify(characterSheet)}`,
  });

  console.log(result.object);

  const mazeWithValidGuids = replaceWithValidGuids(result.object);
  return mazeWithValidGuids;
};
