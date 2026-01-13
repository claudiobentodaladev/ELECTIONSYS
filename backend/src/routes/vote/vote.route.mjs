import { Router } from "express";
import { validator } from "../../utils/middlewares.mjs";
import { voteSchema } from "../../validator/validator.mjs";
import create from "./create.vote.mjs";
import get from "./get.vote.mjs";

const router = Router()

router.use("/create", voteSchema, validator, create)
router.use("/", get)

export default router;