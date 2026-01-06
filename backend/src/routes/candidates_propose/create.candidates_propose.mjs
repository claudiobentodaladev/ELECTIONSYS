import { Router } from "express";
import mysql from "../../database/mysql/db.connection.mjs";
import { isEleitor } from "../../utils/middlewares.mjs";

const router = Router()

router.post("/:election_id", isEleitor, (request, response) => {
    const { election_id } = request.params;
    const { title, body } = request.body;
    const { user } = request;

})

export default router;