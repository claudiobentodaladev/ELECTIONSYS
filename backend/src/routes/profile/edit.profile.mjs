import { Router } from "express";
import { Profile } from "../../database/mongodb/schema/user.schema.mjs";

const router = Router()

router.patch("/", async (request, response) => {
    try {
        const { id } = request.user

        const allowedFields = ["name", "surname", "photo_url"];

        const updateData = {};

        for (const field of allowedFields) {
            if (request.body[field] !== undefined) {
                updateData[field] = request.body[field];
            }
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                error: "no valid data to update!"
            });
        }

        const profile = await Profile.updateOne({ user_id: id }, { $set: updateData }, { new: true })

        if (!profile) {
            return response.status(404).json({
                error: "user not found!"
            });
        }

        return response.status(201).json(profile)

    } catch (err) {
        return response.status(500).json(err);
    }
})

export default router;