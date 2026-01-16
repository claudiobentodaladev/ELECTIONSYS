import { Router } from "express";
import mysql from "../../database/mysql/db.connection.mjs";
import { found } from "../../utils/response.class.mjs";
import { verifyThemeOwnership, getElectionInfo, getElectionsByTheme } from "../../utils/sql/sql.helpers.mjs";

const router = Router()

// Helper function to handle election fetching logic
async function handleElectionFetch(themeId, electionId, userRole, userId) {
    const electionResponse = {
        empty: new found("There's no election on this theme").not(),
        notFound: new found("Election not found").not(),
        ok: {
            filtered(result) {
                return new found(null, result).ok("filtered election")
            },
            all(result) {
                return new found(null, result).ok("all election")
            }
        }
    }

    if (electionId) {
        // Fetch specific election
        const electionResult = await getElectionInfo(electionId, themeId);
        if (!electionResult.success) {
            return { status: 404, response: electionResponse.notFound };
        }
        return { status: 200, response: electionResponse.ok.filtered([electionResult.election]) };
    } else {
        // Fetch all elections of the theme
        const electionsResult = await getElectionsByTheme(themeId);
        if (!electionsResult.success) {
            return { status: 500, response: new found(electionsResult.error).error() };
        }

        if (electionsResult.elections.length === 0) {
            return { status: 200, response: electionResponse.empty };
        }

        return { status: 200, response: electionResponse.ok.all(electionsResult.elections) };
    }
}

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
                    return response.status(404).json(new found("Theme not found or not owned by user").not());
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
                            if (err) resolve({ success: false, error: err.message });
                            else if (result.length === 0) resolve({ success: false, error: "Theme not found" });
                            else resolve({ success: true, themeId: result[0].id });
                        }
                    );
                });

                if (!publicThemeResult.success) {
                    return response.status(404).json(new found("Theme not found").not());
                }

                const eleitorResult = await handleElectionFetch(publicThemeResult.themeId, election_id, user.role, user.id);
                return response.status(eleitorResult.status).json(eleitorResult.response);

            default:
                return response.status(500).json(new found("Invalid user role").error());
        }
    } catch (error) {
        console.error("Error getting elections:", error);
        return response.status(500).json(new found("Internal server error").error());
    }
});

export default router;