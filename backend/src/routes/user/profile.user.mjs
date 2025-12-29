import { Router } from "express";
import { authenticated } from "../../utils/middlewares.mjs";
import { Profile } from "../../database/mongodb/schema/user.schema.mjs";

const router = Router()

router.get("/", authenticated, async (request, response) => {
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

});

router.patch("/", authenticated, async (request, response) => {})

router.patch("/", authenticated, async (request, response) => {})

export default router;