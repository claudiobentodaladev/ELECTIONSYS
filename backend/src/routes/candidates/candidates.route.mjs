import { Router } from "express";
import create from "./create.candidates.mjs";

const router = Router()

router.use("/", create)

export default router;