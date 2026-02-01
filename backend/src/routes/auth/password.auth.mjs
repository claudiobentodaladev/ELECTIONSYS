import { Router } from "express";
import mysql from "../../database/mysql/db.connection.mjs";
import { comparePassword, hashPassword } from "../../utils/hashPassword.mjs";
import { apiResponse } from "../../utils/response.class.mjs";

const router = Router()

router.patch("/", (request, response) => {
    const { user } = request;
    const { password, newPassword } = request.body;

    mysql.execute(
        "SELECT password_hash FROM users WHERE id = ?",
        [user.id], (err, result) => {
            if (err) return response.status(500).json(err)
            if (result.length === 0) return response.status(404).json(
                new apiResponse("There's no user with this ID", request).error()
            )

            const [{ password_hash }] = result;

            if (!comparePassword(password, password_hash)) return response.status(200).json(
                new apiResponse("Wrong password", request).error()
            )

            const hashNewPassword = hashPassword(newPassword);

            mysql.execute(
                "UPDATE users SET password_hash = ? WHERE id = ? LIMIT 1",
                [hashNewPassword, user.id], (err, result) => {
                    if (err) return response.status(500).json(err)

                    return response.status(200).json(
                        new apiResponse("Changed the password", request).ok()
                    )
                }
            )
        }
    )
})

export default router;