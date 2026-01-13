import { Router } from "express";
import { validator, autoUpdateElectionStatus } from "../../utils/middlewares.mjs";
import { createElection } from "../../validator/validator.mjs";
import create from "./create.election.mjs";
import get from "./get.election.mjs";
import edit from "./edit.election.mjs";

const router = Router()

router.use("/create", createElection, validator, create)
router.use("/", autoUpdateElectionStatus, get)
router.use("/", autoUpdateElectionStatus, edit)

export default router;