import { Router } from "express";
import create from "./create.vote.mjs";

const router = Router()

router.use("/", create)

export default router;