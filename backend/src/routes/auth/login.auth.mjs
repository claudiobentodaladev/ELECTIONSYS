import { Router } from "express";
import passport from "passport";
import "../../config/auth.passport.mjs";
import { authResponse } from "../../utils/response.class.mjs";

const router = Router();

router.post("/", passport.authenticate("local"), (request, response) => {
    try {
        const { id, role } = request.user;

        const userData = { id, role }

        return response.status(200).json(
            new authResponse().ok(userData)
        )
    } catch (err) {
        return response.status(400).send(
            new authResponse(err.message).error()
        )
    }
})

export default router;