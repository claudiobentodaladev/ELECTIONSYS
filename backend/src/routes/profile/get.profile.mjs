import { Router } from "express";
import { Profile } from "../../database/mongodb/schema/user.schema.mjs";
import { profileResponse } from "../../utils/response.class.mjs";

const router = Router()

router.get("/", async (request, response) => {
    try {
        const { id, email, role } = request.user;
        const user = { email: email, role: role }
        const profileData = await Profile.findOne({ user_id: id })

        if (!profileData) {
            return response.status(404).json(new profileResponse().error("profile not found"));
        }

        const { name, surname, sex, born_date, photo_url } = profileData;

        let profile;
        switch (role) {
            case "admin":
                profile = {
                    name: name,
                    photo_url: photo_url
                };
                break;
            case "eleitor":
                profile = {
                    name: name,
                    surname: surname,
                    sex: sex,
                    born_date: born_date,
                    photo_url: photo_url
                };
                break;
            default:
                return response.status(500).json(new profileResponse().error("invalid role"));
        }

        response.json(new profileResponse().ok({ user, profile }));
    } catch (err) {
        response.status(500).json(new profileResponse().error("internal server error"));
    }
});

export default router;