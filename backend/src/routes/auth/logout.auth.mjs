import { Router } from "express";

const router = Router();

router.get("/", (request, response) => {
    const { id } = request.user
    request.logOut(err => {
        if (err) {
            return response.sendStatus(400)
        }
        return response.status(200).json({
            isAuthenticated: false,
            message: "user loged out",
            user_id: id
        })
    });
})

export default router;