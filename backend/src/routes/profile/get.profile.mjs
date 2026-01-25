import { Router } from "express";
import { Profile } from "../../database/mongodb/schema/user.schema.mjs";
import { apiResponse } from "../../utils/response.class.mjs";

const router = Router()

router.get("/", async (request, response) => {
    try {
        const { id, email, role } = request.user;
        const user = { email, role }
        const profileData = await Profile.findOne({ user_id: id })

        if (!profileData) return response.status(404).json(
            new apiResponse("profile not found").error(true)
        );

        const { username, name, surname, sex, born_date, photo_url } = profileData;

        let profile;
        switch (role) {
            case "admin":
                profile = {
                    username: username,
                    name: name,
                    photo_url: photo_url
                };
                break;
            case "eleitor":
                profile = {
                    username: username,
                    name: name,
                    surname: surname,
                    sex: sex,
                    born_date: born_date,
                    photo_url: photo_url
                };
                break;
            default:
                return response.status(500).json(
                    new apiResponse("invalid role").error(true)
                );
        }

        response.json(
            new apiResponse("user data").ok({ user, profile })
        );
    } catch (err) {
        response.status(500).json(
            new apiResponse(err.message).error(err)
        );
    }
});

export default router;