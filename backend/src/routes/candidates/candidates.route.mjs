import { Router } from "express";
import { validator } from "../../middleware/validator.middleware.mjs";
import { createCandidateSchema, editCandidateSchema } from "../../validator/validator.mjs";
import create from "./create.candidates.mjs";
import edit from "./edit.candidates.mjs";
import get from "./get.candidates.mjs";
import propose from "./propose/candidates_propose.route.mjs";
import review from "./review.candidates.mjs";

const router = Router()

router.use("/", createCandidateSchema, validator, create)
router.use("/edit", editCandidateSchema, validator, edit)
router.use("/", get)
router.use("/", review)
router.use("/proposes", propose)

export default router;