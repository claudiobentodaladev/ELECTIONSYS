import { Router } from "express";
import create from "./create.candidates_propose.mjs";
import get from "./get.candidates_propose.mjs";
import edit from "./edit.candidates_propose.mjs";
import propose_comentary from "./propose_comentary/propose_comentary.route.mjs";

const router = Router()

router.use("/", create)
router.use("/", get)
router.use("/", edit)
router.use("/comentary", propose_comentary)

export default router;