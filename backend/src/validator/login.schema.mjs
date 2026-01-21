import { checkSchema } from "express-validator";

export const loginSchema = checkSchema({

  "email": {
    in: ["body"],
    notEmpty: { errorMessage: "email is required" },
    isEmail: {
      errorMessage: "Invalid Email"
    },
    normalizeEmail: true
  },

  "password": {
    in: ["body"],
    notEmpty: { errorMessage: "password is required" },
    isLength: {
      options: { min: 6 },
      errorMessage: "Password must be length with 6 character"
    }
  }
});