import { Router } from "express";
import mysql from "../../database/mysql/db.connection.mjs";
import { Profile } from "../../database/mongodb/schema/user.schema.mjs";
import { hashPassword } from "../../utils/hashPassword.mjs";

const router = Router()

router.post("/", (request, response) => {
    try {
        const [{ email, password, role }, profile] = request.body.user;

        if (!["admin", "eleitor"].includes(role)) {
            return response.status(400).json({ message: "role is invalid!", advice: "must be admin or eleitor" })
        }

        mysql.execute("insert into users values(default,?,?,?,default)", [email, hashPassword(password), role], async (err, result) => {
            if (err) {
                return response.status(400).json(err)
            }
            switch (role) {
                case "admin":
                    await Profile.insertOne({
                        user_id: result.insertId,
                        name: profile.name,
                        photo_url: profile.photo_url
                    }).catch(err => {
                        return response.status(400).json(err)
                    }).finally(() => {
                        return response.status(201).json(request.body.user)
                    })
                    break;
                case "eleitor":
                    await Profile.insertOne({
                        user_id: result.insertId,
                        name: profile.name,
                        surname: profile.surname,
                        sex: profile.sex,
                        born_date: profile.born_date,
                        photo_url: profile.photo_url
                    }).catch(err => {
                        return response.status(400).json(err)
                    }).finally(() => {
                        return response.status(201).json(request.body.user)
                    })
                    return response.status(201).json(request.body.user)
                    break;
            }
        })
    } catch (err) {
        return response.status(500).json(err)
    }
})

export default router;