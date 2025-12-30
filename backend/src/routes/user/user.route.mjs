import { Router } from "express";
import profile from "./profile.user.mjs";
import deleteUser from "./delete.user.mjs";

const router = Router()

router.use("/profile", profile)
router.use("/", deleteUser)

export default router;