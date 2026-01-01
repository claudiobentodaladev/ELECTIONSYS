import { Router } from "express";
import { validator } from "../../utils/middlewares.mjs";
import { createElection } from "../../validator/validator.mjs";
import create from "./create.election.mjs";
import get from "./get.election.mjs";

const router = Router()

router.use("/", createElection, validator, create)
router.use("/", get)

export default router;