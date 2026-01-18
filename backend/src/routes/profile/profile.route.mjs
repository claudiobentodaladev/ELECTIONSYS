import { Router } from "express";
import { validator } from "../../middleware/validator.middleware.mjs";
import { editProfileSchema } from "../../validator/validator.mjs";
import get from "./get.profile.mjs";
import edit from "./edit.profile.mjs";

const router = Router()

router.use("/", get)
router.use("/", editProfileSchema, validator, edit)

export default router;