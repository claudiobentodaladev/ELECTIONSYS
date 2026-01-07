import { Router } from "express";
import create from "./create.propose_comentary.mjs";
import get from "./get.propose_comentary.mjs";
import edit from "./edit.propose_comentary.mjs";

const router = Router();

router.use("/", create)
router.use("/", get)
router.use("/", edit)

export default router;