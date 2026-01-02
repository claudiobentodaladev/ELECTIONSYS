import { Router } from "express";
import mysql from "../../database/mysql/db.connection.mjs";

const router = Router();

router.patch("/:election_id", (request, response) => {
    const { user } = request;
    const { election_id } = request.params;
});

export default router;