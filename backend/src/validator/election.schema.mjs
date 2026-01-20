import { body } from "express-validator";

export const election = [
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