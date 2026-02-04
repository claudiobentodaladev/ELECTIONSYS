import { Router } from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.middleware.mjs";
import api from "./api/api.route.mjs";
import auth from "./auth/auth.route.mjs";
import theme from "./theme/theme.route.mjs";
import profile from "./profile/profile.route.mjs";
import election from "./election/election.route.mjs";
import participation from "./participation/participation.route.mjs";
import candidates from "./candidates/candidates.route.mjs";
import vote from "./vote/vote.route.mjs";
import dashboard from "./dashboard/dashboard.route.mjs";
import preferences from "./preferences/preferences.route.mjs";
import notifications from "./notifications/notifications.route.mjs";
import { errorHandler } from "../middleware/error.middleware.mjs";

const router = Router()

router.use("/", api)
router.use("/auth", auth)
router.use("/profile", isAuthenticated, profile)
router.use("/theme", isAuthenticated, theme)
router.use("/election", isAuthenticated, election)
router.use("/participation", isAuthenticated, participation)
router.use("/candidates", isAuthenticated, candidates)
router.use("/vote", isAuthenticated, vote)
router.use("/dashboard", isAuthenticated, dashboard)
router.use("/notifications", isAuthenticated, notifications)
router.use("/preferences", isAuthenticated, preferences)

router.use(errorHandler);

export default router;