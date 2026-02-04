import { Router } from "express";
import { NotificationsController } from "../../controllers/notifications.controller.mjs";

const router = Router()

router.get("/", NotificationsController.getNotifications)

export default router;