import { Router } from "express";
import { isEleitor } from "../../middleware/role.middleware.mjs";
import { autoUpdateElectionStatus } from "../../middleware/autoUpdateElectionStatus.middleware.mjs";
import { ParticipationController } from "../../controllers/participation.controller.mjs";

const router = Router();

router.post("/:election_id", autoUpdateElectionStatus, isEleitor, ParticipationController.createParticipation);

export default router;