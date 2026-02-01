import { Router } from "express";
import { isAdmin } from "../../middleware/role.middleware.mjs";
import { validator } from "../../middleware/validator.middleware.mjs";
import { editThemeSchema } from "../../validator/theme.schema.mjs";
import { ThemeController } from "../../controllers/theme.controller.mjs";

const router = Router();

router.patch("/:theme_id", isAdmin, editThemeSchema, validator, ThemeController.updateTheme);

export default router;
