import { checkSchema } from "express-validator";

export const loginSchema = checkSchema({

  "email": {
    in: ["body"],
    isEmail: {
      errorMessage: "Invalid Email"
    },
    normalizeEmail: true
  },

  "password": {
    in: ["body"],
    isLength: {
      options: { min: 5 },
      errorMessage: "Password must be length with 5 character"
    }
  }

});