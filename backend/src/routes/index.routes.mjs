import { Router, json } from "express";
import bodyParser from "body-parser";
import "../database/mongodb/db.connection.mjs";
import auth from "./auth/auth.route.mjs";

const router = Router()

router.use(json())
router.use(bodyParser.json())

router.use("/auth", auth)

export default router;