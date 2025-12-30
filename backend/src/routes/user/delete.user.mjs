import { Router } from "express";

const router = Router()

router.delete("/", (request, response) => {
    return response.status(200).send("delete is not avaliable now!")
})

export default router;