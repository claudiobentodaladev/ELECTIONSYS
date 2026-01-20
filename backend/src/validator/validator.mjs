import { body, checkSchema } from "express-validator";

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
