import { Router } from "express";
import profile from "./profile.user.mjs";

const router = Router()

router.use("/profile", profile)

export default router;