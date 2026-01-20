import { Router } from "express";
import { validator } from "../../middleware/validator.middleware.mjs";
import { profileSchema } from "../../validator/profile.schema.mjs";
import get from "./get.profile.mjs";
import edit from "./edit.profile.mjs";

const router = Router()

router.use("/", get)
router.use("/", profileSchema, validator, edit)

export default router;