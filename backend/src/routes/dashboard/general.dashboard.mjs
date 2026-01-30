import { Router } from "express";
import mysql from "../../database/mysql/db.connection.mjs";
import { apiResponse } from "../../utils/response.class.mjs";
import { joinedArray } from "../../utils/functions.mjs";

const router = Router()

router.get("/", (request, response) => {
    const { user } = request;

    class status {
        #theme;
        #election;
        #participation;

        constructor(theme, election, participation) {
            this.#theme = theme;
            this.#election = election;
            this.#participation = participation;
        }

        data() {
            return {
                theme: this.#theme,
                election: this.#election,
                participation: this.#participation
            };
        }
    }

    mysql.execute(
        "SELECT id FROM theme WHERE user_id = ?",
        [user.id], (err, result) => {
            if (err) return response.status(500).json(
                new apiResponse(err.message).error(err)
            )
            if (result.length === 0) return response.status(200).json(
                new apiResponse("all admin status").ok(
                    new status(0, 0, 0).data()
                )
            )

            const themeIDs = joinedArray(result)

            let themeStatus = result.length;

            mysql.execute(
                "SELECT id FROM elections WHERE theme_id IN (?)",
                [themeIDs], (err, result) => {
                    if (err) return response.status(500).json(
                        new apiResponse(err.message).error(err)
                    )
                    if (result.length === 0) return response.status(200).json(
                        new apiResponse("all admin status").ok(
                            new status(themeStatus, 0, 0).data()
                        )
                    )

                    const electionIDs = joinedArray(result)

                    let electionStatus = result.length;

                    mysql.execute(
                        "SELECT id FROM participation WHERE election_id IN (?)",
                        [electionIDs], (err, result) => {
                            if (err) return response.status(500).json(
                                new apiResponse(err.message).error(err)
                            )

                            if (result.length === 0) return response.status(200).json(
                                new apiResponse("all admin status").ok(
                                    new status(themeStatus, electionStatus, 0).data()
                                )
                            )

                            let participationStatus = result.length;

                            return response.status(200).json(
                                new apiResponse("all admin status").ok(
                                    new status(themeStatus, electionStatus, participationStatus).data()
                                )
                            )
                        }
                    );
                }
            );
        }
    )
})

export default router;