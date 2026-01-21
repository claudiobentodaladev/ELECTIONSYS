import { checkSchema } from "express-validator";

export const themeSchema = checkSchema({
  title: {
    in: ["body"],
    notEmpty: { errorMessage: "title is required" },
    isString: { errorMessage: "title must be a string" },
    trim: true
  },
  description: {
    in: ["body"],
    optional: true,
    isString: { errorMessage: "description must be a string" },
    trim: true
  }
});