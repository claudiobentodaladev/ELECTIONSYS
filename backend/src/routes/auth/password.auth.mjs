import { Router } from "express";
import mysql from "../../database/mysql/db.connection.mjs";
import { comparePassword, hashPassword } from "../../utils/hashPassword.mjs";

const router = Router()

router.patch("/", (request, response) => {
    const { user } = request;
    const { password, newPassword } = request.body;

    mysql.execute(
        "SELECT password_hash FROM users WHERE id = ?",
        [user.id], (err, result) => {
            if (err) return response.status(500).json(err)
            if (result.length === 0) return response.status(404).json("not found")

            const [{ password_hash }] = result;

            if (!comparePassword(password, password_hash)) return response.status(200).json("wrong password")

            const hashNewPassword = hashPassword(newPassword);

            mysql.execute(
                "UPDATE users SET password_hash = ? WHERE id = ? LIMIT 1",
                [hashNewPassword, user.id], (err, result) => {
                    if (err) return response.status(500).json(err)
                    if (result.length === 0) return response.status(404).json("not found")

                    return response.status(200).json("changed the password")
                }
            )
        }
    )
})

export default router;