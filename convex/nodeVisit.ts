import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getForNodeId = query({
  args: {
    nodeId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("nodeVisit")
      .filter((q) => q.eq(q.field("nodeId"), args.nodeId))
      .collect();
  },
});

export const create = mutation({
  args: {
    nodeId: v.string(),
    nodeImageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("nodeVisit", {
      nodeId: args.nodeId,
      nodeImageUrl: args.nodeImageUrl,
    });
  },
});
