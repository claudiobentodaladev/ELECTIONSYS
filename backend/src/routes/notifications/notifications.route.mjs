import { Router } from "express";
import { NotificationsController } from "../../controllers/notifications.controller.mjs";

const router = Router()

router.use("/", NotificationsController.getNotifications)

export default router;