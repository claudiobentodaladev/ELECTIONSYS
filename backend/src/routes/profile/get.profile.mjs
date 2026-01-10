import { Router } from "express";
import { Profile } from "../../database/mongodb/schema/user.schema.mjs";

const router = Router()

router.get("/", async (request, response) => {
    try {
        const { id, email, role } = request.user;
        const user = { email: email, role: role }
        const { name, surname, sex, born_date, photo_url } = await Profile.findOne({ user_id: id })

        switch (role) {
            case "admin":
                return response.status(200).json({
                    user: user,
                    profile: {
                        name: name,
                        photo_url: photo_url
                    }
                })
                break;

            case "eleitor":
                return response.status(200).json({
                    user: user,
                    profile: {
                        name: name,
                        surname: surname,
                        sex: sex,
                        born_date: born_date,
                        photo_url: photo_url
                    }
                })
                break;

            default:
                return response.sendStatus(400)
                break;
        }
    } catch (err) {
        return response
    }

});

export default router;