import { Router } from "express";
import mysql from "../../database/mysql/db.connection.mjs";
import { isEleitor } from "../../utils/middlewares.mjs";
import { create } from "../../utils/responseStructure.mjs";

const router = Router()

router.post("/:election_id", isEleitor, (request, response) => {
    const { user } = request;
    const { election_id } = request.params;
    const { logo_group_url, group_name, description } = request.body;

    mysql.execute(
        "SELECT * FROM participation WHERE user_id = ? AND election_id = ?"
        , [user.id, election_id], (err, result) => {
            if (err) return response.status(500).json(new create(false, err.message).response())
            if (result.length === 0) return response.status(404).json(new create(false, "There's no participation with this user").response())

            const [{ id, status }] = result;

            if (status === "ineligible") return response.status(200).json(new create(false, "This user is not eligible to be a candidates").response())
            if (status === "voted") return response.status(200).json(new create(false, "This user already voted, not avaliable to be a candidate").response())

            mysql.execute("SELECT * FROM elections WHERE id = ?", [election_id], (err, result) => {
                if (err) return response.status(500).json(new create(false, err.message).response())

                const [{ status }] = result;

                if (status === "ongoing") return response.status(200).json(new create(false, "The election is already started").response())
                if (status === "closed") return response.status(200).json(new create(false, "The election is already closed").response())

                mysql.execute(
                    "INSERT INTO candidates VALUES (default,?,?,?,?,default,default)",
                    [id, logo_group_url, group_name, description],
                    (err, result) => {
                        if (err) return response.status(500).json(new create(false, err.message).response())
                        return response.status(201).json(new create(true, "created the candidation", result.insertId).response())
                    }
                )
            })
        })
});

export default router;