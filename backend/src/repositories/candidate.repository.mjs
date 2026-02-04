import mysql from "../config/database/mysql/db.connection.mjs";

export class CandidateRepository {
    static create(participationId, data) {
        return new Promise((resolve, reject) => {
            mysql.execute(
                "INSERT INTO candidates VALUES (default,?,?,?,?)",
                [participationId, data.logo_group_url, data.group_name, data.description],
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                }
            );
        });
    }

    static findById(id) {
        return new Promise((resolve, reject) => {
            mysql.execute(
                "SELECT * FROM candidates WHERE id = ?",
                [id],
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                }
            );
        });
    }

    static findByParticipationId(participationId) {
        return new Promise((resolve, reject) => {
            mysql.execute(
                "SELECT * FROM candidates WHERE participation_id = ?",
                [participationId],
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                }
            );
        });
    }

    static update(id, data) {
        return new Promise((resolve, reject) => {
            const updates = [];
            const values = [];

            if (data.logo_group_url !== undefined) {
                updates.push("logo_group_url = ?");
                values.push(data.logo_group_url);
            }
            if (data.group_name !== undefined) {
                updates.push("group_name = ?");
                values.push(data.group_name);
            }
            if (data.description !== undefined) {
                updates.push("description = ?");
                values.push(data.description);
            }

            if (updates.length === 0) {
                resolve({ affectedRows: 0 });
                return;
            }

            const updateQuery = `UPDATE candidates SET ${updates.join(", ")} WHERE id = ?`;
            values.push(id);

            mysql.execute(updateQuery, values, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }

    static findByElectionAndUser(user, electionId) {
        return new Promise((resolve, reject) => {
            switch (user.role) {
                case "admin":
                    // Check if election belongs to admin's theme
                    mysql.execute(
                        "SELECT id FROM theme WHERE user_id = ?",
                        [user.id], (err, themeResult) => {
                            if (err) reject(err);
                            else if (themeResult.length === 0) reject(new Error("No theme created by this user"));
                            else {
                                const themeIds = themeResult.map(t => t.id);
                                mysql.execute(
                                    "SELECT id FROM elections WHERE id = ? AND theme_id IN (?)",
                                    [electionId, themeIds], (err, electionResult) => {
                                        if (err) reject(err);
                                        else if (electionResult.length === 0) reject(new Error("Election not found"));
                                        else {
                                            mysql.execute(
                                                "SELECT id FROM participation WHERE election_id = ?",
                                                [electionId], (err, participationResult) => {
                                                    if (err) reject(err);
                                                    else if (participationResult.length === 0) reject(new Error("No participation on this election"));
                                                    else {
                                                        const participationIds = participationResult.map(p => p.id);
                                                        mysql.execute(
                                                            `SELECT * FROM candidates WHERE participation_id IN (?)`,
                                                            [participationIds], (err, candidatesResult) => {
                                                                if (err) reject(err);
                                                                else resolve(candidatesResult);
                                                            }
                                                        );
                                                    }
                                                }
                                            );
                                        }
                                    }
                                );
                            }
                        }
                    );
                    break;

                case "eleitor":
                    mysql.execute(
                        "SELECT id FROM participation WHERE user_id = ? AND election_id = ?",
                        [user.id, electionId], (err, participationResult) => {
                            if (err) reject(err);
                            else if (participationResult.length === 0) reject(new Error("This user is not participating on this election"));
                            else {
                                mysql.execute(
                                    "SELECT id FROM participation WHERE election_id = ?",
                                    [electionId], (err, allParticipationResult) => {
                                        if (err) reject(err);
                                        else if (allParticipationResult.length === 0) reject(new Error("No participation on this election"));
                                        else {
                                            const participationIds = allParticipationResult.map(p => p.id);
                                            mysql.execute(
                                                "SELECT * FROM candidates WHERE participation_id IN (?)",
                                                [participationIds], (err, candidatesResult) => {
                                                    if (err) reject(err);
                                                    else resolve(candidatesResult);
                                                }
                                            );
                                        }
                                    }
                                );
                            }
                        }
                    );
                    break;

                default:
                    reject(new Error("Invalid role"));
            }
        });
    }

    static checkOwnership(candidateId, userId) {
        return new Promise((resolve, reject) => {
            mysql.execute(
                `SELECT p.user_id FROM candidates c JOIN participation p ON c.participation_id = p.id WHERE c.id = ?`,
                [candidateId],
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result.length > 0 && result[0].user_id === userId);
                }
            );
        });
    }

    static checkAdminAuthorization(adminId, candidateId) {
        return new Promise((resolve, reject) => {
            mysql.execute(
                "SELECT participation_id FROM candidates WHERE id = ?",
                [candidateId], (err, candidateResult) => {
                    if (err) reject(err);
                    else if (candidateResult.length === 0) resolve(false);
                    else {
                        const { participation_id } = candidateResult[0];
                        mysql.execute(
                            "SELECT election_id FROM participation WHERE id = ?",
                            [participation_id], (err, participationResult) => {
                                if (err) reject(err);
                                else if (participationResult.length === 0) resolve(false);
                                else {
                                    const { election_id } = participationResult[0];
                                    mysql.execute(
                                        "SELECT theme_id FROM elections WHERE id = ?",
                                        [election_id], (err, electionResult) => {
                                            if (err) reject(err);
                                            else if (electionResult.length === 0) resolve(false);
                                            else {
                                                const { theme_id } = electionResult[0];
                                                mysql.execute(
                                                    "SELECT id FROM theme WHERE id = ? AND user_id = ?",
                                                    [theme_id, adminId], (err, themeResult) => {
                                                        if (err) reject(err);
                                                        else resolve(themeResult.length > 0);
                                                    }
                                                );
                                            }
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

    static updateStatus(candidateId, status) {
        return new Promise((resolve, reject) => {
            mysql.execute(
                "UPDATE candidates SET status = ? WHERE id = ?",
                [status, candidateId],
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                }
            );
        });
    }
}