import { Router } from "express";
import { election } from "../../validator/election.schema.mjs";
import { validator } from "../../middleware/validator.middleware.mjs";
import { isAdmin } from "../../middleware/role.middleware.mjs";
import { ElectionController } from "../../controllers/election.controller.mjs";

const router = Router();

router.patch("/:election_id", election, validator, isAdmin, ElectionController.updateElection);

export default router;