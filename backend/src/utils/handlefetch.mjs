import { apiResponse } from "./response.class.mjs";
import { getElectionInfo, getElectionsByTheme } from "./sql/sql.helpers.mjs";

// Helper function to handle election fetching logic
export async function handleElectionFetch(themeId, electionId, userRole, userId) {
    const electionResponse = {
        empty: new apiResponse("There's no election on this theme").error(true),
        notFound: new apiResponse("Election not found").error(),
        ok: {
            filtered(result) {
                return new apiResponse("filtered election").ok(result)
            },
            all(result) {
                return new apiResponse("all election").ok(result)
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