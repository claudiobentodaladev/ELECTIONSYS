import mysql from "../config/database/mysql/db.connection.mjs";
import { joinedArray } from "../utils/functions.mjs";

export class DashboardRepository {
    static getAdminStats(userId) {
        return new Promise((resolve, reject) => {
            // Get themes count
            mysql.execute(
                "SELECT id FROM theme WHERE user_id = ?",
                [userId], (err, themeResult) => {
                    if (err) reject(err);
                    else if (themeResult.length === 0) resolve({ themes: 0, elections: 0, participations: 0 });
                    else {
                        const themeIds = joinedArray(themeResult);
                        const themeCount = themeResult.length;

                        // Get elections count
                        mysql.execute(
                            "SELECT id FROM elections WHERE theme_id IN (?)",
                            [themeIds], (err, electionResult) => {
                                if (err) reject(err);
                                else if (electionResult.length === 0) resolve({ themes: themeCount, elections: 0, participations: 0 });
                                else {
                                    const electionIds = joinedArray(electionResult);
                                    const electionCount = electionResult.length;

                                    // Get participations count
                                    mysql.execute(
                                        "SELECT id FROM participation WHERE election_id IN (?)",
                                        [electionIds], (err, participationResult) => {
                                            if (err) reject(err);
                                            else resolve({
                                                themes: themeCount,
                                                elections: electionCount,
                                                participations: participationResult.length
                                            });
                                        }
                                    );
                                }
                            }
                        );
                    }
                }
            );
        });
    }
}