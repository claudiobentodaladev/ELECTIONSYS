import { Router } from "express";

const router = Router();

router.get("/", (request, response) => {
    request.logOut(err => {
        if (err) {
            return response.sendStatus(400)
        }
        return response.sendStatus(200)
    });
})

export default router;