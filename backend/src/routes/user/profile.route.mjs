import { Router } from "express";
import get from "./get.profile.mjs";
import edit from "./edit.profile.mjs";

const router = Router()

router.use("/", get)
router.use("/", edit)

export default router;