import { Router } from "express";
import mysql from "../../database/mysql/db.connection.mjs";
import { isAdmin } from "../../utils/middlewares.mjs";

const router = Router();

router.patch("/:election_id/:participation_id", isAdmin, (request, response) => {
    const { election_id, participation_id } = request.params;
    const { user } = request;

    mysql.execute(
        "SELECT * FROM theme WHERE user_id = ?",
        [user.id], (err, result) => {
            if (err) return response.status(500).json(err)
            if (result.length === 0) return response.status(200).json({ found: false, message: "election not found!" })

            const [{ id }] = result;

            mysql.execute("select * from elections where id = ? and theme_id = ?", [election_id, id], (err, result) => {
                if (err) return response.status(500).json(err)
                if (result.length === 0) return response.status(500).json({ message: "election not found!" })

                mysql.execute("SELECT status FROM participation WHERE id = ?", [participation_id], (err, result) => {
                    if (err) return response.status(500).json(err)
                    if (result.length === 0) return response.status(500).json({ message: "election not found!" })

                    const [{ status }] = result;

                    if (status === "voted") return response.status(400).json({ message: " not reviewed the participation, because status is voted", reviewed: false, status: status, participation_id: participation_id })

                    let statusToggle = () => {
                        if (status === "ineligible") return "eligible"
                        else return "ineligible"
                    }

                    mysql.execute("UPDATE participation SET status = ? WHERE id = ?", [statusToggle(), participation_id], (err, result) => {
                        if (err) return response.status(500).json(err)
                        if (result.length === 0) return response.status(500).json({ message: "election not found!" })

                        return response.status(200).json({ message: "reviewed the participation", reviewed: true, participation_id: participation_id })
                    })
                })
            })

        }
    )
});

export default router;