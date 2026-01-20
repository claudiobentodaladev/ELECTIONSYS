import { checkSchema } from "express-validator";

export const themeSchema = checkSchema({
  title: {
    in: ["body"],
    isString: { errorMessage: "title must be a string" },
    trim: true,
    notEmpty: { errorMessage: "title is required" }
  },
  description: {
    in: ["body"],
    optional: true,
    isString: { errorMessage: "description must be a string" },
    trim: true
  }
});