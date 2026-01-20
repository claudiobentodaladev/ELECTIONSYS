import { body, checkSchema } from "express-validator";

export const createCandidateSchema = checkSchema({
  name: {
    in: ["body"],
    isString: { errorMessage: "name must be a string" },
    trim: true,
    notEmpty: { errorMessage: "name is required" }
  },
  description: {
    in: ["body"],
    optional: true,
    isString: { errorMessage: "description must be a string" },
    trim: true
  },
  photo_url: {
    in: ["body"],
    optional: true,
    isURL: { errorMessage: "photo_url must be a valid URL" }
  },
  election_id: {
    in: ["body"],
    isMongoId: { errorMessage: "election_id must be a valid MongoDB ObjectId" }
  }
});

export const editCandidateSchema = checkSchema({
  name: {
    in: ["body"],
    optional: true,
    isString: { errorMessage: "name must be a string" },
    trim: true,
    notEmpty: { errorMessage: "name cannot be empty if provided" }
  },
  description: {
    in: ["body"],
    optional: true,
    isString: { errorMessage: "description must be a string" },
    trim: true
  },
  photo_url: {
    in: ["body"],
    optional: true,
    isURL: { errorMessage: "photo_url must be a valid URL" }
  }
});