import { checkSchema } from "express-validator";

export const signSchema = checkSchema({
  "user.email": {
    in: ["body"],
    notEmpty: { errorMessage: "Email is required" },
    isEmail: { errorMessage: "Invalid Email" }
  },

  "user.password": {
    in: ["body"],
    isLength: {
      options: { min: 6 },
      errorMessage: "Password must be length with 6 character"
    }
  },

  "user.role": {
    in: ["body"],
    isIn: {
      options: [["admin", "eleitor"]],
      errorMessage: "role must be admin or eleitor"
    }
  },

  "profile.username": {
    in: ["body"],
    notEmpty: { errorMessage: "username is required" },
    isString: { errorMessage: "username must be string" }
  },

  "profile.name": {
    in: ["body"],
    notEmpty: { errorMessage: "name is required" }
  },

  "profile.surname": {
    in: ["body"],
    optional: true
  },

  "profile.sex": {
    in: ["body"],
    optional: true,
    isIn: {
      options: [["M", "F"]],
      errorMessage: "sex must be M or F"
    }
  },

  "profile.born_date": {
    in: ["body"],
    optional: true,
    isISO8601: {
      errorMessage: "born_date must be YYYY-MM-DD"
    }
  },

  "profile.photo_url": {
    in: ["body"],
    optional: true,
    isURL: {
      errorMessage: "photo_url must be a valid URL"
    }
  }
});