import { Router } from "express";
import create from "./create.election.mjs";
import get from "./get.election.mjs";

const router = Router()

router.use("/", create)
router.use("/", get)

export default router;