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
    // GET FOR ADMIN
});

export default router;