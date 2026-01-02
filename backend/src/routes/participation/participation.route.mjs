import { Router } from "express";
import create from "./create.participation.mjs";

const router = Router();

router.use("/", create)

export default router;