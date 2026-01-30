import { Router } from "express";
import mysql from "../../database/mysql/db.connection.mjs";
import { apiResponse } from "../../utils/response.class.mjs";
import { joinedArray } from "../../utils/functions.mjs";

const router = Router()

router.get("/", (request, response) => {
    const { user } = request;

    const status = {
        theme: undefined,
        election: undefined,
        participation: undefined
    }

    mysql.execute(
        "SELECT id FROM theme WHERE user_id = ?",
        [user.id], (err, result) => {
            if (err) return response.status(500).json(
                new apiResponse(err.message).error(err)
            )
            if (result.length === 0) {

                status.theme = result.length;
                status.election = 0;
                status.participation = 0;

                return response.status(200).json(
                    new apiResponse("all admin status").ok(status)
                )
            }

            const themeIDs = joinedArray(result)

            status.theme = result.length;

            mysql.execute(
                "SELECT id FROM elections WHERE theme_id IN (?)",
                [themeIDs], (err, result) => {
                    if (err) return response.status(500).json(
                        new apiResponse(err.message).error(err)
                    )
                    if (result.length === 0) {

                        status.election = result.length;
                        status.participation = 0;

                        return response.status(200).json(
                            new apiResponse("all admin status").ok(status)
                        )
                    }

                    const electionIDs = joinedArray(result)

                    status.election = result.length;

                    mysql.execute(
                        "SELECT id FROM participation WHERE election_id IN (?)",
                        [electionIDs], (err, result) => {
                            if (err) return response.status(500).json(
                                new apiResponse(err.message).error(err)
                            )

                            status.participation = result.length;

                            return response.status(200).json(
                                new apiResponse("all admin status").ok(status)
                            )
                        }
                    );
                }
            );
        }
    )
})

export default router;