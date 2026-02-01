import { Router } from "express";
import { isAdmin, isEleitor } from "../../middleware/role.middleware.mjs";
import { ThemeController } from "../../controllers/theme.controller.mjs";

const router = Router()

router.get("/", isAdmin, ThemeController.getThemes);

export default router;