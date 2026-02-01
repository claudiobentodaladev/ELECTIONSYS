import { Router } from "express";
import mysql from "../../database/mysql/db.connection.mjs";
import { isAdmin, isEleitor } from "../../middleware/role.middleware.mjs";
import { joinedArray } from "../../utils/functions.mjs";
import { apiResponse } from "../../utils/response.class.mjs";

const router = Router();

router.get("/", isEleitor, (request, response) => {
    const { user } = request;

    mysql.execute("select * from participation where user_id = ?", [user.id], (err, result) => {
        if (err) return response.status(500).json(
            new apiResponse("Database error", request).error(err)
        )
        if (result.length === 0) return response.status(500).json(new apiResponse("Theres no participation!", request).error({ found: false }))

        return response.status(200).json(new apiResponse("Participations retrieved", request).ok(result))
    })
});

router.get("/:election_id", isAdmin, (request, response) => {
    const { user } = request;
    const { election_id } = request.params;

    mysql.execute(
        "SELECT id FROM theme WHERE user_id = ?",
        [user.id], (err, result) => {
            if (err) return response.status(500).json(new apiResponse("Database error", request).error(err))
            if (result.length === 0) return response.status(500).json(new apiResponse("Theres no theme!", request).error({ found: false }))

            const themeIDs = joinedArray(result)

            mysql.execute(
                "SELECT id FROM elections WHERE id = ? AND theme_id IN(?)",
                [election_id, themeIDs], (err, result) => {
                    if (err) return response.status(500).json(new apiResponse("Database error", request).error(err))
                    if (result.length === 0) return response.status(500).json(new apiResponse("Election not found", request).error({ found: false }))

                    const [{ id }] = result;

                    mysql.execute(
                        "SELECT * FROM participation WHERE election_id = ?",
                        [id], (err, result) => {
                            if (err) return response.status(500).json(new apiResponse("Database error", request).error(err))
                            if (result.length === 0) return response.status(500).json(new apiResponse("No participations found", request).error({ found: false }))

                            return response.status(200).json(new apiResponse("Participations retrieved", request).ok(result))
                        }
                    )
                }
            )
        }
    )
});

export default router;