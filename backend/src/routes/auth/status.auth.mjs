import { Router } from "express";
import { AuthController } from "../../controllers/auth.controller.mjs";

const router = Router();

router.get("/", AuthController.getStatus);

export default router;