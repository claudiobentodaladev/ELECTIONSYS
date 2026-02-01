import { Router } from "express";
import { isAdmin } from "../../middleware/role.middleware.mjs";
import { validator } from "../../middleware/validator.middleware.mjs";
import { themeSchema } from "../../validator/theme.schema.mjs";
import { ThemeController } from "../../controllers/theme.controller.mjs";

const router = Router();

router.post("/", isAdmin, themeSchema, validator, ThemeController.createTheme);

export default router;