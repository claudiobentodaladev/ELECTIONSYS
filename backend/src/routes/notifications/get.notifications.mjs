import { Router } from "express";
import { apiResponse } from "../../utils/response.class.mjs";

const router = Router()

router.get("/", (request, response) => {
    response.status(200).json(new apiResponse("Notifications retrieved", request).ok("Notifications!!!"))
})

export default router;