import { Router } from "express";
import { isAdmin } from "../../middleware/role.middleware.mjs";
import { validator } from "../../middleware/validator.middleware.mjs";
import { themeSchema } from "../../validator/theme.schema.mjs";
import mysql from "../../database/mysql/db.connection.mjs";
import { apiResponse } from "../../utils/response.class.mjs";

const router = Router()

router.post("/", isAdmin, themeSchema, validator, (request, response) => {
    const { user } = request;
    const { photo_theme_url, name, description } = request.body;

    mysql.execute("INSERT INTO theme VALUES (default,?,?,?,?)",
        [user.id, photo_theme_url, name, description], (err, result) => {
            if (err) return response.status(500).json(
                new apiResponse(err.message).error(err)
            )
            if (result.affectedRows === 0) return response.status(500).json(
                new apiResponse("Theme not inserted").error(true)
            )
            response.status(201).json(
                new apiResponse("Inserted a new theme").ok({ photo_theme_url, name, description })
            )
        }
    )
});

export default router;