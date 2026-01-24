import { Router } from "express";
import { Preferences } from "../../database/mongodb/schema/preferences.schema.mjs";
import { apiResponse } from "../../utils/response.class.mjs";

const router = Router()

router.patch("/", async (request, response) => {
    try {
        const { user } = request;

        // serialize bigInt 

        const { theme } = await Preferences.findOne({ user_id: user.id });

        let switchedTheme;
        switch (theme) {
            case "LIGHT":
                switchedTheme = "DARK";
                break;
            case "DARK":
                switchedTheme = "LIGHT";
                break;
            default:
                break;
        }

        await Preferences.updateOne({ user_id: user.id }, { $set: { theme: switchedTheme } })

        return response.status(200).json(
            new apiResponse("switched the theme").ok({
                user_id: user.id,
                theme: switchedTheme
            })
        )
    } catch (err) {
        console.log(err)
        return response.status(500).json(err)
    }
})

export default router;