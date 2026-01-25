import { Router } from "express";
import { Profile } from "../../database/mongodb/schema/user.schema.mjs";
import { apiResponse } from "../../utils/response.class.mjs";

const router = Router()

router.patch("/", async (request, response) => {
    try {
        const { id } = request.user

        const allowedFields = ["username", "name", "surname", "photo_url"];

        const updateData = {};

        for (const field of allowedFields) {
            if (request.body[field] !== undefined) {
                updateData[field] = request.body[field];
            }
        }

        if (Object.keys(updateData).length === 0) return response.status(400).json(
            new apiResponse("no valid data to update").error(true)
        );

        const profile = await Profile.updateOne({ user_id: id }, { $set: updateData }, { new: true })

        if (!profile.modifiedCount) return response.status(404).json(
            new apiResponse("user not found").error(true)
        );

        response.status(200).json(
            new apiResponse("updated the profile").ok(updateData)
        );

    } catch (err) {
        response.status(500).json(
            new apiResponse(err.message).error(err)
        );
    }
})

export default router;