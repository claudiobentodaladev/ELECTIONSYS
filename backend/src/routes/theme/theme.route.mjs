import { Router } from "express";
import { validator } from "../../middleware/validator.middleware.mjs";
import { createThemeSchema } from "../../validator/validator.mjs";
import create from "./create.theme.mjs";
import get from "./get.theme.mjs";

const router = Router()

router.use("/", createThemeSchema, validator, create)
router.use("/", get)

export default router;