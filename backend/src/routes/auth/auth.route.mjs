import { Router } from "express";
import sign from "./sign.auth.mjs";
import login from "./login.auth.mjs";
import logout from "./logout.auth.mjs";

const router = Router()

router.use("/sign", sign)
router.use("/login", login)
router.use("/logout", logout)

export default router;