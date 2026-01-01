import { Router } from "express";
import { isAdmin, validator } from "../../utils/middlewares.mjs";
import { createElection } from "../../validator/validator.mjs";
import create from "./create.election.mjs";
import get from "./get.election.mjs";

const router = Router()

router.use("/", isAdmin, createElection, validator, create)
router.use("/", isAdmin, get)

export default router;