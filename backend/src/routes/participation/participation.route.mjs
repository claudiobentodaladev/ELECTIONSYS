import { Router } from "express";
import { validator } from "../../middleware/validator.middleware.mjs";
import { participationSchema } from "../../validator/validator.mjs";
import create from "./create.participation.mjs";
import get from "./get.partcipation.mjs";
import review from "./review.participation.mjs";

const router = Router();

router.use("/create", participationSchema, validator, create)
router.use("/", get)
router.use("/", review)

export default router;