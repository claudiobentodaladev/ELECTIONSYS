import { Router } from "express";
import mysql from "../../database/mysql/db.connection.mjs";
import { isEleitor } from "../../utils/middlewares.mjs";

const router = Router()

router.post("/:election_id", isEleitor, (request, response) => {
    const { user } = request;
    const { election_id } = request.params;
    const { logo_group_url, group_name, description } = request.body;

    mysql.execute("SELECT * FROM participation WHERE user_id = ? AND election_id = ?", [user.id, election_id], (err, result) => {
        if (err) return response.status(500).json(err)
        if (result.length === 0) return response.status(404).json({ created: false, message: "not found!" })
        const participation_id = result[0].id;

        if (result[0].status === "ineligible") return response.status(200).json({ created: false, message: "not eligible to be a candidates!" })
        if (result[0].status === "voted") return response.status(200).json({ created: false, message: "already voted, not avaliable to be a candidate!" })

        mysql.execute("SELECT * FROM elections WHERE id = ?", [election_id], (err, result) => {
            if (err) return response.status(500).json(err)
            if (result[0].status === "ongoing") return response.status(200).json({ created: false, message: "election is ongoing!" })
            if (result[0].status === "closed") return response.status(200).json({ created: false, message: "election is closed!" })

            mysql.execute(
                "INSERT INTO candidates VALUES (default,?,?,?,?,default,default)",
                [participation_id, logo_group_url, group_name, description],
                (err, result) => {
                    if (err) return response.status(500).json(err)
                    return response.status(201).json({ message: "candidate created", created: true, candidate_id: result.insertId })
                }
            )
        })
    })
});

export default router;