import { Router } from "express";
import passport from "passport";
import "../../config/auth.passport.mjs";
import { apiResponse } from "../../utils/response.class.mjs";
// not real and true
const router = Router();

router.post("/", passport.authenticate("local"), (request, response) => {
    try {
        const { id, role } = request.user;

        const userData = { id, role }

        return response.status(200).json(
            new apiResponse("user is authenticated!", request).ok(userData)
        )
    } catch (err) {
        return response.status(400).send(
            new apiResponse(err.message).error()
        )
    }
})

export default router;