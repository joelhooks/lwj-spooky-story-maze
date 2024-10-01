import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  characters: defineTable({
    backstory: v.string(),
    class: v.string(),
    experience: v.float64(),
    health: v.float64(),
    inventory: v.array(v.string()),
    level: v.float64(),
    maxHealth: v.float64(),
    name: v.string(),
    stats: v.object({
      dexterity: v.float64(),
      intelligence: v.float64(),
      strength: v.float64(),
    }),
  }),
  mazes: defineTable({
    edges: v.array(
      v.object({
        id: v.string(),
        sourceId: v.string(),
        targetId: v.string(),
        transitionPrompt: v.string(),
      }),
    ),
    id: v.string(),
    metadata: v.object({
      bossNodeId: v.string(),
      checkpointNodeIds: v.array(v.string()),
      startNodeId: v.string(),
    }),
    name: v.string(),
    nodes: v.array(
      v.object({
        id: v.string(),
        initialVisitImagePrompt: v.string(),
        initialVisitPrompt: v.string(),
        name: v.string(),
        returnVisitPrompt: v.string(),
        theme: v.string(),
        type: v.string(),
      }),
    ),
    overallDifficulty: v.float64(),
    seed: v.string(),
    theme: v.string(),
  }),
  nodeVisit: defineTable({
    nodeId: v.string(),
    nodeImageUrl: v.string(),
  }),
});
