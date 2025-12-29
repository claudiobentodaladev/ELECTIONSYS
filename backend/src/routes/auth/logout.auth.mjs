import { Router } from "express";
import { authenticated } from "../../utils/middlewares.mjs";

const router = Router();

router.get("/", authenticated, (request, response) => {
    request.logOut(err => {
        if (err) {
            return response.sendStatus(400)
        }
        return response.sendStatus(200)
    });
})

export default router;