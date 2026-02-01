import { Router } from "express";
import { validator } from "../../middleware/validator.middleware.mjs";
import { voteSchema } from "../../validator/vote.schema.mjs";
import { VoteController } from "../../controllers/vote.controller.mjs";
import { isEleitor } from "../../middleware/role.middleware.mjs";
import { autoUpdateElectionStatus } from "../../middleware/autoUpdateElectionStatus.middleware.mjs";

const router = Router()

// Create vote
router.post("/:candidate_id", autoUpdateElectionStatus, isEleitor, voteSchema, validator, VoteController.createVote)

// Get votes
router.get("/:election_id", autoUpdateElectionStatus, VoteController.getVotes)

export default router;