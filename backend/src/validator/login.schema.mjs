import { checkSchema } from "express-validator";

export const loginSchema = checkSchema({

  "email": {
    in: ["body"],
    notEmpty: { errorMessage: "email cannot be empty if provided" },
    isEmail: {
      errorMessage: "Invalid Email"
    },
    normalizeEmail: true
  },

  "password": {
    in: ["body"],
    notEmpty: { errorMessage: "password cannot be empty if provided" },
    isLength: {
      options: { min: 6 },
      errorMessage: "Password must be length with 6 character"
    }
  }
});