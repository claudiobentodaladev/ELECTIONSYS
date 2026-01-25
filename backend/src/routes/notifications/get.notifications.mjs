import { Router } from "express";

const router = Router()

router.get("/", (request, response) => {
    response.status(200).json("Notifications!!!")
})

export default router;