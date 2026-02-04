import { Router } from "express";
import { APIController } from "../../controllers/api.controller.mjs";

const router = Router()

router.get("/", APIController.getAPIStatus)

export default router;