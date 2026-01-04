import { Router } from "express";
import mysql from "../../database/mysql/db.connection.mjs";
import { isAdmin, isEleitor } from "../../utils/middlewares.mjs";

const router = Router();

router.get("/", isEleitor, (request, response) => {
    const { user } = request;

    mysql.execute("select * from participation where user_id = ?", [user.id], (err, result) => {
        if (err) return response.status(500).json(err)
        return response.status(200).json(result)
    })

});

router.get("/:election_id", isAdmin, (request, response) => {
    const { user } = request;
    const { election_id } = request.params;

    mysql.execute("select * from elections where user_id = ? and id = ?", [user.id, election_id], (err, result) => {
        if (err) {
            return response.status(500).json(err)
        }

        if (result.length === 0) {
            return response.status(500).json({ message: "election not found!" })
        }

        mysql.execute("select * from participation where election_id = ?", [election_id], (err, result) => {
            if (err) {
                return response.status(500).json(err)
            }

            if (result.length === 0) {
                return response.status(500).json({ message: "election not found!" })
            }

            return response.status(200).json(result)
        })
    })

});

export default router;