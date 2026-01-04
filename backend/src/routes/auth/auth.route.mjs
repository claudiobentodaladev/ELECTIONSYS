import { Router } from "express";
import { isAuthenticated, validator } from "../../utils/middlewares.mjs";
import { loginSchema, signSchema } from "../../validator/validator.mjs";
import sign from "./sign.auth.mjs";
import login from "./login.auth.mjs";
import logout from "./logout.auth.mjs";

const router = Router()

router.use("/sign", signSchema, validator, sign)
router.use("/login", loginSchema, validator, login)
router.use("/logout", isAuthenticated, logout)

export default router;