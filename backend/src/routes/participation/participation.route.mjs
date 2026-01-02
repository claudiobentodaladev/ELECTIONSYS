import { Router } from "express";
import { isEleitor, isAdmin } from "../../utils/middlewares.mjs";
import create from "./create.participation.mjs";
import get from "./get.partcipation.mjs";

const router = Router();

router.use("/", isEleitor, create)
router.use("/", get)

export default router;