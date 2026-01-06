import { Router } from "express";
import create from "./create.candidates_propose.mjs";
import get from "./get.candidates_propose.mjs";

const router = Router()

router.use("/", create)
router.use("/", get)

export default router;