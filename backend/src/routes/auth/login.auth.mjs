import { Router } from "express";
import session from "express-session";
import passport from "passport";
import "../../config/auth.passport.mjs";

const router = Router();

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

router.post("/in", passport.authenticate("local"), (request, response) => {
    const {user} = request;
    return response.status(200).json({authenticated: true,user: user})
})

router.get("/in", (request, response) => {
    const {user} = request;
    if (!user) {
        return response.status(200).json({authenticated: false})
    }
    return response.status(200).json({authenticated: true,user: user})
})





export default router;