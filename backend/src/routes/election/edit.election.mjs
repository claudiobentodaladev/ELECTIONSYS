import { Router } from "express";
import mysql from "../../database/mysql/db.connection.mjs";

const router = Router();

router.patch("/:election_id", (request, response) => {
    // Dinamic edit data, with no required field, like edit(patch) profile
    const { user } = request;
    const { election_id } = request.params;
    return response.status(200).send("election!")
})

export default router;

