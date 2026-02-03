import { Router } from "express";
import { isAuthenticated } from "../../middleware/isAuthenticated.middleware.mjs";
import { validator } from "../../middleware/validator.middleware.mjs";
import { loginSchema } from "../../validator/login.schema.mjs";
import { signSchema } from "../../validator/sign.schema.mjs";
import { passwordSchema, passwordValidator } from "../../validator/password.schema.mjs";
import { AuthController } from "../../controllers/auth.controller.mjs";
import { notAuthenticated } from "../../middleware/notAuthenticated.middleware.mjs";

const router = Router()

router.post("/sign", signSchema, validator, notAuthenticated, AuthController.register)
router.post("/login", loginSchema, validator, AuthController.login)
router.post("/logout", isAuthenticated, AuthController.logout)
router.get("/status", isAuthenticated, AuthController.getStatus)
router.patch("/password", isAuthenticated, passwordSchema, passwordValidator, validator, AuthController.updatePassword)

export default router;