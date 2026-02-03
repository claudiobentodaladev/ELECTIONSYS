import { Router } from "express";
import { AuthController } from "../../controllers/auth.controller.mjs";

const router = Router();

router.post("/", AuthController.logout)

export default router;