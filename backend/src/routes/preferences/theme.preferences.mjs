import { Router } from "express";
import { Preferences } from "../../database/mongodb/schema/preferences.schema.mjs";
import { Profile } from "../../database/mongodb/schema/user.schema.mjs";
import { profileResponse } from "../../utils/response.class.mjs";

const router = Router()

router.patch("/", async (request, response) => {
    try {
        const { id } = request.user;

        // serialize bigInt 

        const currentTheme = await Preferences.findOne({ user_id: id });

        //   await Preferences.updateOne({user_id: user.id}, {})

        return response.status(200).json(currentTheme)

    } catch (err) {
        console.log(err)
        return response.status(500).json(err)
    }
})

export default router;