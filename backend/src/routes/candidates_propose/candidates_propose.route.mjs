import { Router } from "express";
import create from "./create.candidates_propose.mjs";

const router = Router()

router.use("/", create)

export default router;