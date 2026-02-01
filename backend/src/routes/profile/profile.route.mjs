import { Router } from "express";
import { validator } from "../../middleware/validator.middleware.mjs";
import { profileSchema } from "../../validator/profile.schema.mjs";
import { ProfileController } from "../../controllers/profile.controller.mjs";

const router = Router()

// Get profile
router.get("/", ProfileController.getProfile)

// Update profile
router.patch("/", profileSchema, validator, ProfileController.updateProfile)

export default router;