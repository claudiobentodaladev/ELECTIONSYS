import { Router } from "express";
import sign from "./sign.auth.mjs";
import login from "./login.auth.mjs";

const router = Router()

router.use("/sign", sign)
router.use("/login", login)

export default router;