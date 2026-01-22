import { Router } from "express";
import { logOutUser } from "../../utils/response.class.mjs";

const router = Router();

router.get("/", (request, response) => {
    const { id, role } = request.user;

    const userData = { id, role }
    request.logOut(err => {
        if (err) return response.status(400).json(
            new logOutUser(err.message).error()
        )
        return response.status(200).json(
            new logOutUser().ok(userData)
        )
    });
})

export default router;