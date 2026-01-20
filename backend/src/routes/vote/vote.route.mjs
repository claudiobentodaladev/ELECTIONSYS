import { Router } from "express";
import { validator } from "../../middleware/validator.middleware.mjs";
import { voteSchema } from "../../validator/vote.schema.mjs";
import create from "./create.vote.mjs";
import get from "./get.vote.mjs";

const router = Router()

router.use("/", voteSchema, validator, create)
router.use("/", get)

export default router;