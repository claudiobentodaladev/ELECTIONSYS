import { Router } from "express";
import { AuthController } from "../../controllers/auth.controller.mjs";

const router = Router()

router.patch("/", AuthController.updatePassword)

export default router;