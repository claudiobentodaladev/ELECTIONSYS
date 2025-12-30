import { Router } from "express";
import { authenticated } from "../../utils/middlewares.mjs";

const router = Router()

router.delete("/", authenticated,(request, response) => {
    return response.status(200).send("delete is not avaliable now!")
})

export default router;