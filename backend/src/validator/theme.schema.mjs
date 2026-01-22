import { checkSchema } from "express-validator";

export const themeSchema = checkSchema({

  photo_url: {
    in: ["body"],
    optional: true,
    isURL: {
      errorMessage: "photo_url must be a valid URL"
    }
  },
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