import { Router } from "express";
import theme from "./theme.preferences.mjs";

const router = Router()

router.use("/theme", theme)

export default router;