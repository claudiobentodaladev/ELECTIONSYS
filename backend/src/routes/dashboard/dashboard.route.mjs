import { Router } from "express";
import { DashboardController } from "../../controllers/dashboard.controller.mjs";

const router = Router()

// Get dashboard stats
router.get("/", DashboardController.getDashboard)

export default router;