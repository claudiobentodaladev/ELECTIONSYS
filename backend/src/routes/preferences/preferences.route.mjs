import { Router } from "express";
import { PreferencesController } from "../../controllers/preferences.controller.mjs";

const router = Router()

// Switch theme
router.patch("/theme", PreferencesController.switchTheme)

export default router;