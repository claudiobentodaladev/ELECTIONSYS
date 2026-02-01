import { checkSchema } from "express-validator";

export const themeSchema = checkSchema({

  photo_election_url: {
    in: ["body"],
    optional: true,
    isURL: {
      errorMessage: "photo_election_url must be a valid URL"
    }
  },
  name: {
    in: ["body"],
    notEmpty: { errorMessage: "name is required" },
    isString: { errorMessage: "name must be a string" },
    trim: true
  },
  description: {
    in: ["body"],
    optional: true,
    isString: { errorMessage: "description must be a string" },
    trim: true
  }
});

export const editThemeSchema = checkSchema({

  photo_election_url: {
    in: ["body"],
    optional: true,
    isURL: {
      errorMessage: "photo_election_url must be a valid URL"
    }
  },
  name: {
    in: ["body"],
    optional: true,
    isString: { errorMessage: "name must be a string" },
    trim: true
  },
  description: {
    in: ["body"],
    optional: true,
    isString: { errorMessage: "description must be a string" },
    trim: true
  }
});