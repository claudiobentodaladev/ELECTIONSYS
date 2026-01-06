import { Router } from "express";
import { isEleitor } from "../../utils/middlewares.mjs";
import mysql from "../../database/mysql/db.connection.mjs";

const router = Router()

// to get propose as a normal eleitor
router.get("/:candidate_id", isEleitor, (request, response) => {
    
})

router.get("/:election_id", isEleitor, (request, response) => {
    // to get propose as a candidate
})

export default router;