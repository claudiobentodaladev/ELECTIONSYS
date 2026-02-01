import { Router } from "express";
import { ElectionController } from "../../controllers/election.controller.mjs";

const router = Router();

router.get("/:theme_id", ElectionController.getElections);

export default router;