import { Router } from "express";
import session from "express-session";
import passport from "passport";
import sign from "./sign.auth.mjs";
import login from "./login.auth.mjs";
import logout from "./logout.auth.mjs";

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

router.use("/sign", sign)
router.use("/login", login)
router.use("/logout", logout)

export default router;