import { checkSchema } from "express-validator";

export const participationSchema = checkSchema({
  election_id: {
    in: ["body"],
    isMongoId: { errorMessage: "election_id must be a valid MongoDB ObjectId" }
  }
});