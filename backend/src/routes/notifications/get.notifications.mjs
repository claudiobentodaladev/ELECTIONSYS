import { Router } from "express";
import { NotificationsController } from "../../controllers/notifications.controller.mjs";

const router = Router()

// Get notifications
router.get("/", NotificationsController.getNotifications)

export default router;