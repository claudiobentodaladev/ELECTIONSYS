import { Router } from "express";
import mysql from "../../database/mysql/db.connection.mjs";
import { isAdmin, isEleitor } from "../../utils/middlewares.mjs";
import { joinedArray } from "../../utils/functions.mjs";

const router = Router();

router.get("/", isEleitor, (request, response) => {
    const { user } = request;

    mysql.execute("select * from participation where user_id = ?", [user.id], (err, result) => {
        if (err) return response.status(500).json(err)
        if (result.length === 0) return response.status(500).json({ found: false, message: "Theres no participation!" })

        return response.status(200).json(result)
    })
});

router.get("/:election_id", isAdmin, (request, response) => {
    const { user } = request;
    const { election_id } = request.params;

    mysql.execute(
        "SELECT id FROM theme WHERE user_id = ?",
        [user.id], (err, result) => {
            if (err) return response.status(500).json(err)
            if (result.length === 0) return response.status(500).json({ found: false, message: "Theres no participation!" })

            const themeIDs = joinedArray(result)

            mysql.execute(
                "SELECT id FROM elections WHERE id = ? AND theme_id IN(?)",
                [election_id, themeIDs], (err, result) => {
                    if (err) return response.status(500).json(err)
                    if (result.length === 0) return response.status(500).json({ found: false, message: "Theres no participation!" })

                    const [{ id }] = result;

                    mysql.execute(
                        "SELECT * FROM participation WHERE election_id = ?",
                        [id], (err, result) => {
                            if (err) return response.status(500).json(err)
                            if (result.length === 0) return response.status(500).json({ found: false, message: "Theres no participation!" })

                            return response.status(200).json(result)
                        }
                    )
                }
            )
        }
    )
});

export default router;