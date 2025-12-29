import { Router } from "express";
import { authenticated } from "../../utils/middlewares.mjs";
import { Profile } from "../../database/mongodb/schema/user.schema.mjs";

const router = Router()

router.get("/", authenticated, (request, response) => {
    return response.status(201).send("Profile!")
});

export default router;