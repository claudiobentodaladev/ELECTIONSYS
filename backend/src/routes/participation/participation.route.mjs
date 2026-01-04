import { Router } from "express";
import create from "./create.participation.mjs";
import get from "./get.partcipation.mjs";
import review from "./review.participation.mjs";

const router = Router();

router.use("/", create)
router.use("/", get)
router.use("/", review)

export default router;