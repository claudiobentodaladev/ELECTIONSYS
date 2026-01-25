import { Router } from "express";
import mysql from "../../database/mysql/db.connection.mjs";
import { apiResponse } from "../../utils/response.class.mjs";
import { verifyThemeOwnership } from "../../utils/sql/sql.helpers.mjs";
import { handleElectionFetch } from "../../utils/handlefetch.mjs";

const router = Router()

router.get("/:theme_id", async (request, response) => {
    const { user } = request;
    const { theme_id } = request.params;
    const { election_id } = request.query;

    try {
        switch (user.role) {
            case "admin":
                // Verify if the theme belongs to the admin
                const themeResult = await verifyThemeOwnership(theme_id, user.id);
                if (!themeResult.success) {
                    return response.status(404).json(
                        new apiResponse(themeResult.message).error(true)
                    );
                }

                const adminResult = await handleElectionFetch(themeResult.themeId, election_id, user.role, user.id);
                return response.status(adminResult.status).json(adminResult.response);

            case "eleitor":
                // Verify if the theme exists (voters can see public elections)
                const publicThemeResult = await new Promise((resolve) => {
                    mysql.execute(
                        "SELECT id FROM theme WHERE id = ?",
                        [theme_id],
                        (err, result) => {
                            if (err) resolve({ success: false, message: err.message });
                            else if (result.length === 0) resolve({ success: false, message: "Theme not found" });
                            else resolve({ success: true, themeId: result[0].id });
                        }
                    );
                });

                if (!publicThemeResult.success) {
                    return response.status(404).json(
                        new apiResponse(publicThemeResult.message).error(true)
                    );
                }

                const eleitorResult = await handleElectionFetch(publicThemeResult.themeId, election_id, user.role, user.id);
                return response.status(eleitorResult.status).json(eleitorResult.response);

            default:
                return response.status(500).json(
                    new apiResponse("Invalid user role").error()
                );
        }
    } catch (err) {
        return response.status(500).json(
            new apiResponse(err.message).error()
        );
    }
});

export default router;