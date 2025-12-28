import { Router } from "express";

const router = Router()

router.post("/sign", (request, response) => {
    const [{ email, password, role }, profile] = request.body;

    switch (role) {
        case "admin":
            const { name_, photo_url_ } = profile;
            break;
        case "eleitor":
            const { name, surname, sex, born_date, photo_url } = profile;
            break;
        default:
            return response.status(400).json({ message: "role is invalid!", advice: "must be admin or eleitor" })
            break;
    }
    //insert user
    // find user_id by email in database
    // use the found user_id to insert into profile
    return response.status(201).send("created")

})

export default router;