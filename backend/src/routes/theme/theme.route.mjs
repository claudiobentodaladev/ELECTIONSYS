import { Router } from "express";
import create from "./create.theme.mjs";

const router = Router()

router.use("/", create)

export default router;