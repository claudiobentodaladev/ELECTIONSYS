import { Router, json } from "express";
import session from "express-session";
import connectMongo from "connect-mongo";
import mongoose from "mongoose";
import passport from "passport";
import bodyParser from "body-parser";
import { authenticated, isAdmin } from "../utils/middlewares.mjs";
import "../database/mongodb/db.connection.mjs";
import auth from "./auth/auth.route.mjs";
import profile from "./user/profile.route.mjs";
import election from "./election/election.route.mjs";
import participation from "./participation/participation.route.mjs";


const router = Router()

router.use(session({
    secret: "helloC",
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 60
    },
    store: connectMongo.create({
        client: mongoose.connection.getClient()
    })
}));
router.use(passport.initialize());
router.use(passport.session());
router.use(json())
router.use(bodyParser.json())

router.use("/auth", auth)
router.use("/profile", authenticated, profile)
router.use("/election", authenticated, isAdmin, election)
router.use("/participation", participation)

export default router;