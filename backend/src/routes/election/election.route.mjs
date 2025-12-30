import { Router } from "express";
import { isAdmin, validator } from "../../utils/middlewares.mjs";
import { createElection } from "../../validator/validator.mjs";
import create from "./create.election.mjs";

const router = Router()

router.use("/", isAdmin, createElection, validator, create)

export default router;