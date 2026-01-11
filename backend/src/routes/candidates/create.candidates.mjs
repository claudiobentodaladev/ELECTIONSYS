import { Router } from "express";
import mysql from "../../database/mysql/db.connection.mjs";
import { isEleitor } from "../../utils/middlewares.mjs";
import { create } from "../../utils/response.class.mjs";

const router = Router()

router.post("/:election_id", isEleitor, (request, response) => {
    const { user } = request;
    const { election_id } = request.params;
    const { logo_group_url, group_name, description } = request.body;

    mysql.execute(
        "SELECT * FROM participation WHERE user_id = ? AND election_id = ?"
        , [user.id, election_id], (err, result) => {
            if (err) return response.status(500).json(new create(err.message).error())
            if (result.length === 0) return response.status(404).json(new create("There's no participation with this user").not())

            const [{ id, status }] = result;

            if (status === "ineligible") return response.status(403).json(new create("This user is not eligible to be a candidates").not())
            if (status === "voted") return response.status(403).json(new create("This user already voted, not avaliable to be a candidate").not())

            mysql.execute("SELECT * FROM elections WHERE id = ?", [election_id], (err, result) => {
                if (err) return response.status(500).json(new create(err.message).error())

                const [{ status }] = result;

                if (status === "ongoing") return response.status(403).json(new create("The election is already started").not())
                if (status === "closed") return response.status(403).json(new create("The election is already closed").not())

                mysql.execute(
                    "INSERT INTO candidates VALUES (default,?,?,?,?,default,default)",
                    [id, logo_group_url, group_name, description],
                    (err, result) => {
                        if (err) return response.status(500).json(new create(err.message).error())
                        return response.status(201).json(new create(null, result.insertId).ok("candidation"))
                    }
                )
            })
        })
});

export default router;