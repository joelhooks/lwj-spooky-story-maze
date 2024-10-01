import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const get = query({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("mazes")
      .filter((q) => q.eq(q.field("id"), args.id))
      .first();
  },
});

export const createMaze = mutation({
  args: {
    maze: v.object({
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
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("mazes", args.maze);
  },
});
