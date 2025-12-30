import { Router } from "express";
import passport from "passport";
import "../../config/auth.passport.mjs";

const router = Router();

router.post("/", passport.authenticate("local"), (request, response) => {
    const { id } = request.user;
    return response.status(200).json({ isAuthenticated: true, user_id: id })
})

export default router;