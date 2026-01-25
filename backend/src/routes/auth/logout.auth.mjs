import { Router } from "express";
import { apiResponse } from "../../utils/response.class.mjs";

const router = Router();

router.get("/", (request, response) => {
    const { id, role } = request.user;

    const userData = { id, role }

    request.logOut(err => {
        if (err) return response.status(400).json(
            new apiResponse(err.message).error(true)
        )
        return response.status(200).json(
            new apiResponse("user is logged out!").ok(userData)
        )
    });
})

export default router;