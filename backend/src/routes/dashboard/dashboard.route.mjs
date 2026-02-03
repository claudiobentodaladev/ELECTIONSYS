import { Router } from "express";
import { DashboardController } from "../../controllers/dashboard.controller.mjs";
import general from "./general.dashboard.mjs";

const router = Router()

// Get dashboard stats
router.get("/", DashboardController.getDashboard)

export default router;