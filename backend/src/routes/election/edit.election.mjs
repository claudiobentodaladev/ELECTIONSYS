import { Router } from "express";

const router = Router();

router.patch("/:election_id", (request, response) => {
    // Dinamic edit data, with no required field, like edit(patch) profile
    return response.status(200).send("election!")
})

export default router;

