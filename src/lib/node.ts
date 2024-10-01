"use server";

import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import "server-only";
import { NodeGenerationSchema, NodeSchema, NodeVisitSchema } from "@/schemas";
import {
  extendImageWithDescription,
  generateImageForDescription,
} from "./image-generator";

// Update the NodeContent type
export type NodeContent = {
  description: string;
  availableActions: string[];
  image_prompt: string;
};

// New type for ASCII art
export type AsciiArt = {
  art: string;
};

export const generateNodeContent = async (
  node: z.infer<typeof NodeGenerationSchema>,
  previousVisits: z.infer<typeof NodeVisitSchema>[],
  scarinessLevel: number,
): Promise<NodeContent & { nodeImageUrl: string }> => {
  console.log(node);
  const resultPromise = generateObject({
    model: openai("gpt-4o-2024-08-06", {
      structuredOutputs: true,
    }),
    schemaName: "nodeContent",
    schemaDescription: "Content for a node in the text-based adventure game.",
    schema: z.object({
      description: z.string().describe("Detailed description of the room"),
      image_prompt: z
        .string()
        .describe("Prompt for the image generation of the room"),
      availableActions: z
        .array(z.string())
        .describe("List of possible actions the user can take in this room"),
    }),
    system: `You are an AI specializing in generating immersive content for text-based adventure games. Your task is to create 
    engaging room descriptions and suggest possible actions for the player.`,
    prompt: `Generate content for a room in a text-based adventure game.
    Use the following prompt as a guide: "${node.initialVisitPrompt}"
    
    ${
      previousVisits
        ? `If this is a revisit, also consider this context: "${
            node.returnVisitPrompt
          }"
    User's progress: ${JSON.stringify(previousVisits)}
    
    `
        : ""
    }
    
    
    
    Remember to:
    1. Provide a detailed, atmospheric description of the room.
    2. Suggest 3 possible actions the player can take in this room.

    The scariness level is ${scarinessLevel}. be sure to honor this on a scale of 1 to 10.

    1 is a little shiver, 10 is a full on horror movie nightmae fuel.
    1 is tame, 10 is graphic and gory.
    
    Ensure the content is cohesive and reflects the eerie, ghost-themed atmosphere of the mansion.
    
    Format your response as a valid JSON object with the following structure:
    {
      "description": "Your room description here",
      "availableActions": ["Action 1", "Action 2", "Action 3"],
      "image_prompt": "Prompt for the image generation of the room"
    }`,
  });

  const nodeImagePromise =
    previousVisits.length > 0
      ? extendImageWithDescription(
          previousVisits[previousVisits.length - 1].nodeImageUrl,
          node.initialVisitImagePrompt,
        )
      : generateImageForDescription(node.initialVisitImagePrompt);

  const [results, nodeImage] = await Promise.all([
    resultPromise,
    nodeImagePromise,
  ]);

  const nodeDetails = results.object;

  return {
    ...nodeDetails,
    nodeImageUrl: nodeImage,
  };
};
