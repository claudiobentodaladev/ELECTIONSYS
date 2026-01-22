import { Router, json } from "express";
import session from "express-session";
import connectMongo from "connect-mongo";
import mongoose from "mongoose";
import passport from "passport";
import { isAuthenticated } from "../middleware/isAuthenticated.middleware.mjs";
import "../database/mongodb/db.connection.mjs";
import auth from "./auth/auth.route.mjs";
import profile from "./profile/profile.route.mjs";
import theme from "./theme/theme.route.mjs";
import election from "./election/election.route.mjs";
import participation from "./participation/participation.route.mjs";
import candidates from "./candidates/candidates.route.mjs";
import vote from "./vote/vote.route.mjs";
import dashboard from "./dashboard/dashboard.route.mjs";

const router = Router()

router.use(session({
    secret: process.env.SESSION_SECRET || "helloC",
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 1000 * 60 * 60,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    },
    store: connectMongo.create({
        client: mongoose.connection.getClient()
    })
}));
router.use(passport.initialize());
router.use(passport.session());

router.use("/auth", auth)
router.use("/profile", isAuthenticated, profile)
router.use("/election", isAuthenticated, election)
router.use("/participation", isAuthenticated, participation)
router.use("/candidates", isAuthenticated, candidates)
router.use("/theme", isAuthenticated, theme)
router.use("/vote", isAuthenticated, vote)
router.use("/dashboard", isAuthenticated, dashboard)

export default router;