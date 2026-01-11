import { Router } from "express";
import mysql from "../../database/mysql/db.connection.mjs";
import { found } from "../../utils/response.class.mjs";

const router = Router()

router.get("/:theme_id", (request, response) => {
    const { user } = request;
    const { theme_id } = request.params;
    const { election_id } = request.query;

    const electionResponse = {
        empty: new found("There's no election on this theme").not(),
        notFound: new found("Election not found").not(),
        ok: {
            filtered(result) {
                return new found(null, result).ok("filtered election")
            },
            all(result) {
                return new found(null, result).ok("all election")
            }
        }
    }

    switch (user.role) {
        case "admin":
            mysql.execute(
                "SELECT id FROM theme WHERE user_id = ? AND id = ?",
                [user.id, theme_id], (err, result) => {
                    if (err) return response.status(500).json(new found(err.message).error())
                    if (result.length === 0) return response.status(200).json(electionResponse.empty)

                    const [{ id }] = result;

                    // SAME <-
                    if (election_id) {
                        mysql.execute(
                            "SELECT * FROM elections WHERE id = ? AND theme_id = ?",
                            [election_id, id], (err, result) => {
                                if (err) return response.status(500).json(new found(err.message).error())
                                if (result.length === 0) return response.status(404).json(electionResponse.notFound)

                                return response.status(200).json(electionResponse.ok.filtered(result))
                            }
                        )
                    } else {
                        mysql.execute(
                            "SELECT * FROM elections WHERE theme_id = ?",
                            [id], (err, result) => {
                                if (err) return response.status(500).json(new found(err.message).error())
                                if (result.length === 0) return response.status(404).json(electionResponse.empty)

                                return response.status(200).json(electionResponse.ok.all(result))
                            }
                        )
                    }
                }
            )
            break;

        case "eleitor":
            mysql.execute(
                "SELECT id FROM theme WHERE id = ?",
                [theme_id], (err, result) => {
                    if (err) return response.status(500).json(err)
                    if (result.length === 0) return response.status(200).json({ found: false, message: "election not found!" })

                    const [{ id }] = result;

                    // SAME <-
                    if (election_id) {
                        mysql.execute(
                            "SELECT * FROM elections WHERE id = ? AND theme_id = ?",
                            [election_id, id], (err, result) => {
                                if (err) return response.status(500).json(new found(err.message).error())
                                if (result.length === 0) return response.status(404).json(electionResponse.notFound)

                                return response.status(200).json(electionResponse.ok.filtered(result))
                            }
                        )
                    } else {
                        mysql.execute(
                            "SELECT * FROM elections WHERE theme_id = ?",
                            [id], (err, result) => {
                                if (err) return response.status(500).json(new found(err.message).error())
                                if (result.length === 0) return response.status(404).json(electionResponse.empty)

                                return response.status(200).json(electionResponse.ok.all(result))
                            }
                        )
                    }
                }
            )
            break;

        default:
            return response.sendStatus(500)
            break;
    }

})

export default router;