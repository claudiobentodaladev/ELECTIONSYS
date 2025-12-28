import { Router } from "express";
import mysql from "../../database/mysql/db.connection.mjs";
import { hashPassword } from "../../utils/hashPassword.mjs";

const router = Router()

router.post("/sign", (request, response) => {
    const [{ email, password, role },profile] = request.body.user;

    if (!["admin", "eleitor"].includes(role)) {
        return response.status(400).json({ message: "role is invalid!", advice: "must be admin or eleitor" })
    }
    //insert user
    mysql.execute("insert into users values(default,?,?,?,default)", [email, hashPassword(password), role], (err, result) => {
        if (err) {
            return response.status(400).json(err)
        }
        return response.status(201).json(result) // object with id: insertId
    })
    // find user_id by email in database
    // use the found user_id to insert into profile
})

export default router;