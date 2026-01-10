import { Router } from "express";
import create from "./create.candidates.mjs";
import get from "./get.candidates.route.mjs";
import propose from "./propose/candidates_propose.route.mjs";
import review from "./review.candidates.mjs";

const router = Router()

router.use("/", create)
router.use("/", get)
router.use("/", review)
router.use("/proposes", propose)

export default router;