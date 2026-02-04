import { Router } from "express";
import { isAdmin } from "../../middleware/role.middleware.mjs";
import { themeSchema } from "../../validator/theme.schema.mjs";
import { editThemeSchema } from "../../validator/theme.schema.mjs";
import { validator } from "../../middleware/validator.middleware.mjs";
import { ThemeController } from "../../controllers/theme.controller.mjs";




const router = Router()

router.post("/", isAdmin, themeSchema, validator, ThemeController.createTheme)
router.get("/", isAdmin, ThemeController.getThemes)
router.patch("/:theme_id", isAdmin, editThemeSchema, validator, ThemeController.updateTheme)

export default router;