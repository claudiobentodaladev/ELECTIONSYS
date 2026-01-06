import { Router } from "express";
import create from "./create.candidates_propose.mjs";

const router = Router()

router.use("/", create)
// create get propose  with participation_id

export default router;