import { Router } from "express";
import { isAuthenticated } from "../../middleware/isAuthenticated.middleware.mjs";
import { validator } from "../../middleware/validator.middleware.mjs";
import { loginSchema } from "../../validator/login.schema.mjs";
import { signSchema } from "../../validator/sign.schema.mjs";
import sign from "./sign.auth.mjs";
import login from "./login.auth.mjs";
import logout from "./logout.auth.mjs";
import status from "./status.auth.mjs";

const router = Router()

router.use("/sign", signSchema, validator, sign)
router.use("/login", loginSchema, validator, login)
router.use("/logout", isAuthenticated, logout)
router.use("/status", isAuthenticated, status)

export default router;