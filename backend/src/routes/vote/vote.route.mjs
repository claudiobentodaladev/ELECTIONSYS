import { Router } from "express";
import create from "./create.vote.mjs";
import get from "./get.vote.mjs";

const router = Router()

router.use("/", create)
router.use("/", get)

export default router;