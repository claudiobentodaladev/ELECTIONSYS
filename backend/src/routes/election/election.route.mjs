import { Router } from "express";
import { validator } from "../../middleware/validator.middleware.mjs";
import { autoUpdateElectionStatus } from "../../middleware/autoUpdateElectionStatus.middleware.mjs";
import { election } from "../../validator/election.schema.mjs";
import create from "./create.election.mjs";
import get from "./get.election.mjs";
import edit from "./edit.election.mjs";

const router = Router()

router.use("/", election, validator, create)
router.use("/", autoUpdateElectionStatus, get)
router.use("/", autoUpdateElectionStatus, edit)

export default router;