import { body, checkSchema } from "express-validator";

export const voteSchema = checkSchema({
  candidate_id: {
    in: ["body"],
    isMongoId: { errorMessage: "candidate_id must be a valid MongoDB ObjectId" }
  }
});