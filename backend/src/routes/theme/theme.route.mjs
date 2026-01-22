import { Router } from "express";
import create from "./create.theme.mjs";
import get from "./get.theme.mjs";

const router = Router()

router.use("/", create)
router.use("/", get)

export default router;