import { Router } from "express";
import passport from "passport";
import "../../config/auth.passport.mjs";

const router = Router();

router.post("/", passport.authenticate("local"), (request, response) => {
    const { user } = request;
    return response.status(200).json({ authenticated: true, user: user })
})

router.get("/", (request, response) => {
    const { user } = request;
    if (!user) {
        return response.status(200).json({ authenticated: false })
    }
    return response.status(200).json({ authenticated: true, user: user })
});

export default router;