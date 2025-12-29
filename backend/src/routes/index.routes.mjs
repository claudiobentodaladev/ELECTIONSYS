import { Router, json } from "express";
import session from "express-session";
import passport from "passport";
import bodyParser from "body-parser";
import "../database/mongodb/db.connection.mjs";
import auth from "./auth/auth.route.mjs";
import user from "./user/user.route.mjs";


const router = Router()

router.use(session({
    secret: "helloC",
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 60
    }
}));
router.use(passport.initialize());
router.use(passport.session());
router.use(json())
router.use(bodyParser.json())

router.use("/auth", auth)
router.use("/user", user)

export default router;