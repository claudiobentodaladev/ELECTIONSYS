import { Router } from "express";
import get from "./get.notifications.mjs";

const router = Router()

router.use("/", get)

export default router;