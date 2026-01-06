import { Router } from "express";
import create from "./create.candidates.mjs";
import get from "./get.candidates.route.mjs";

const router = Router()

router.use("/", create)
router.use("/", get)

export default router;