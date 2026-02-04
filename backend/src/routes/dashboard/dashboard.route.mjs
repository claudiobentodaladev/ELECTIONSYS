import { Router } from "express";
import { isAdmin } from "../../middleware/role.middleware.mjs";
import { DashboardController } from "../../controllers/dashboard.controller.mjs";

const router = Router()

// Get dashboard stats
router.get("/", isAdmin,DashboardController.getDashboard)

export default router;