import { Router } from "express";
import { authenticated } from "../../utils/middlewares.mjs";
import { Profile } from "../../database/mongodb/schema/user.schema.mjs";

const router = Router()

router.get("/", authenticated, async (request, response) => {
    const {user} = request;
    const result = await Profile.find()
    return response.status(200).send(result)
});

export default router;