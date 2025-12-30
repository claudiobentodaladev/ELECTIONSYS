import { body,checkSchema } from "express-validator";

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

export const signSchema = checkSchema({
  email: {
    in: ["body"],
    isEmail: { errorMessage: "Invalid Email" },
    notEmpty: { errorMessage: "Email is required" }
  },

  password: {
    in: ["body"],
    isLength: {
      options: { min: 5 },
      errorMessage: "Password must be length with 5 character"
    }
  },

  role: {
    in: ["body"],
    isIn: {
      options: [["admin", "eleitor"]],
      errorMessage: "role must be admin or eleitor"
    }
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

export const createElection = [
    body("title")
        .exists().withMessage("title is required")
        .isString().withMessage("title must be a string")
        .trim()
        .notEmpty(),

    body("description")
        .exists().withMessage("description is required")
        .isString().withMessage("description must be a string")
        .trim()
        .notEmpty(),

    body("start_at")
        .exists().withMessage("start_at is required")
        .isObject().withMessage("start_at must be an object"),

    body("end_at")
        .exists().withMessage("end_at is required")
        .isObject().withMessage("end_at must be an object"),

    // start_at fields
    body("start_at.year").isInt({ min: 1970 }),
    body("start_at.month").isInt({ min: 1, max: 12 }),
    body("start_at.day").isInt({ min: 1, max: 31 }),
    body("start_at.hour").isInt({ min: 0, max: 23 }),
    body("start_at.minute").isInt({ min: 0, max: 59 }),

    // end_at fields
    body("end_at.year").isInt({ min: 1970 }),
    body("end_at.month").isInt({ min: 1, max: 12 }),
    body("end_at.day").isInt({ min: 1, max: 31 }),
    body("end_at.hour").isInt({ min: 0, max: 23 }),
    body("end_at.minute").isInt({ min: 0, max: 59 }),
];
