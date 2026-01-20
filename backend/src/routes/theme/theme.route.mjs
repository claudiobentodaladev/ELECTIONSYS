import { Router } from "express";
import { validator } from "../../middleware/validator.middleware.mjs";
import { themeSchema } from "../../validator/theme.schema.mjs";
import create from "./create.theme.mjs";
import get from "./get.theme.mjs";

const router = Router()

router.use("/", themeSchema, validator, create)
router.use("/", get)

export default router;