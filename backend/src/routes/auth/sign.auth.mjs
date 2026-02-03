import { Router } from "express";
import { notAuthenticated } from "../../middleware/notAuthenticated.middleware.mjs";
import { AuthController } from "../../controllers/auth.controller.mjs";

const router = Router();

router.post("/", notAuthenticated, AuthController.register);

export default router;