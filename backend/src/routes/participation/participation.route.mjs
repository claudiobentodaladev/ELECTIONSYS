import { Router } from "express";
import { validator } from "../../middleware/validator.middleware.mjs";
import { participationSchema } from "../../validator/participation.schema.mjs";
import get from "./get.partcipation.mjs";
import review from "./review.participation.mjs";
import { isEleitor } from "../../middleware/role.middleware.mjs";
import { autoUpdateElectionStatus } from "../../middleware/autoUpdateElectionStatus.middleware.mjs";
import { ParticipationController } from "../../controllers/participation.controller.mjs";


const router = Router();

router.post("/:election_id", participationSchema, validator, autoUpdateElectionStatus, isEleitor, ParticipationController.createParticipation)
router.use("/", get)
router.use("/", review)

export default router;