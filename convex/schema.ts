import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({
    author: v.string(),
    content: v.string(),
    timestamp: v.number(),
  }),
  files: defineTable({
    user: v.string(),
    fileName: v.string(),
    fileUrl: v.string(),
    uploadDate: v.string(),
  }),
});
