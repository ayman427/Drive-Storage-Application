import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

export const schema = {
  user: v.string(),
  fileName: v.string(),
  fileUrl: v.string(),
  uploadDate: v.string(),
};

// Query to get all files for the current user
export const getFilesForUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }
    return await ctx.db
      .query("files")
      .filter((q) => q.eq(q.field("user"), identity.email))
      .collect();
  },
});

// Mutation to upload a new file
export const uploadFile = mutation({
  args: {
    user: v.string(),
    fileName: v.string(),
    fileUrl: v.string(),
    uploadDate: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("files", {
      user: args.user,
      fileName: args.fileName,
      fileUrl: args.fileUrl,
      uploadDate: args.uploadDate,
    });
  },
});

export const deleteFile = mutation({
  args: {
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    const id = args.fileId as Id<"files">;
    await ctx.db.delete(id);
  },
});

// Mutation to rename a file
export const renameFile = mutation({
  args: {
    fileId: v.string(),
    newFileName: v.string(),
  },
  handler: async (ctx, args) => {
    const { fileId, newFileName } = args;
    const id = fileId as Id<"files">;

    // Check if the file exists
    const file = await ctx.db
      .query("files")
      .filter((q) => q.eq(q.field("_id"), id))
      .first();
    if (!file) {
      throw new Error("File not found");
    }

    // Update the file's name
    await ctx.db.patch(id, {
      fileName: newFileName,
    });
  },
});
