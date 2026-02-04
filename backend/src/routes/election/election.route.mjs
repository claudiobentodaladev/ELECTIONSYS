import { Router } from "express";
import { autoUpdateElectionStatus } from "../../middleware/autoUpdateElectionStatus.middleware.mjs";
import { electionSchema } from "../../validator/election.schema.mjs";
import { validator } from "../../middleware/validator.middleware.mjs";
import { isAdmin } from "../../middleware/role.middleware.mjs";
import { ElectionController } from "../../controllers/election.controller.mjs";

const router = Router()

router.post("/:theme_id", electionSchema, validator, isAdmin, ElectionController.createElection)
router.get("/:theme_id", autoUpdateElectionStatus, ElectionController.getElections)
router.use("/:election_id", isAdmin, electionSchema, validator, autoUpdateElectionStatus, ElectionController.updateElection)

export default router;