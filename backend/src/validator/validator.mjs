import { body, checkSchema } from "express-validator";

export const signSchema = checkSchema({
  username: {
    in: ["body"],
    isString: { errorMessage: "username must be string" },
    notEmpty: { errorMessage: "username is required" }
  },
  email: {
    in: ["body"],
    isEmail: { errorMessage: "Invalid Email" },
    notEmpty: { errorMessage: "Email is required" }
  },

  password: {
    in: ["body"],
    isLength: {
      options: { min: 6 },
      errorMessage: "Password must be length with 6 character"
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

export const editProfileSchema = checkSchema({
  name: {
    in: ["body"],
    optional: true,
    isString: { errorMessage: "name must be a string" },
    trim: true,
    notEmpty: { errorMessage: "name cannot be empty" }
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

export const createThemeSchema = checkSchema({
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

export const createCandidateSchema = checkSchema({
  name: {
    in: ["body"],
    isString: { errorMessage: "name must be a string" },
    trim: true,
    notEmpty: { errorMessage: "name is required" }
  },
  description: {
    in: ["body"],
    optional: true,
    isString: { errorMessage: "description must be a string" },
    trim: true
  },
  photo_url: {
    in: ["body"],
    optional: true,
    isURL: { errorMessage: "photo_url must be a valid URL" }
  },
  election_id: {
    in: ["body"],
    isMongoId: { errorMessage: "election_id must be a valid MongoDB ObjectId" }
  }
});

export const editCandidateSchema = checkSchema({
  name: {
    in: ["body"],
    optional: true,
    isString: { errorMessage: "name must be a string" },
    trim: true,
    notEmpty: { errorMessage: "name cannot be empty if provided" }
  },
  description: {
    in: ["body"],
    optional: true,
    isString: { errorMessage: "description must be a string" },
    trim: true
  },
  photo_url: {
    in: ["body"],
    optional: true,
    isURL: { errorMessage: "photo_url must be a valid URL" }
  }
});

export const voteSchema = checkSchema({
  candidate_id: {
    in: ["body"],
    isMongoId: { errorMessage: "candidate_id must be a valid MongoDB ObjectId" }
  }
});

export const participationSchema = checkSchema({
  election_id: {
    in: ["body"],
    isMongoId: { errorMessage: "election_id must be a valid MongoDB ObjectId" }
  }
});
