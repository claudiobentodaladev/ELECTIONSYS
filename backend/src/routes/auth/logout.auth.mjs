import { Router } from "express";
import session from "express-session";
import passport from "passport";
import "../../config/auth.passport.mjs";

const router = Router();

router.use(passport.initialize());
router.use(passport.session());
/*
router.get("/", (request, response) => {
    request.logOut(err => {
        if (err) {
            return response.sendStatus(400)
        }
        return response.sendStatus(200)
    });
})
*/
export default router;