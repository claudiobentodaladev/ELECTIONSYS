import { checkSchema } from "express-validator";

export const profileSchema = checkSchema({
  name: {
    in: ["body"],
    optional: true,
    notEmpty: { errorMessage: "name cannot be empty" },
    isString: { errorMessage: "name must be a string" },
    trim: true,
  },
  surname: {
    in: ["body"],
    optional: true,
    isString: { errorMessage: "surname must be a string" },
    trim: true
  },
  photo_url: {
    in: ["body"],
    optional: true,
    isURL: { errorMessage: "photo_url must be a valid URL" }
  }
});