import { Router, json } from "express";
import bodyParser from "body-parser";
import auth from "./auth/user.route.mjs";

const router = Router()

router.use(json())
router.use(bodyParser.json())

router.use("/auth", auth)

export default router;