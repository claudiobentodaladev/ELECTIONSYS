import mysql from "../config/database/mysql/db.connection.mjs";

export class VoteRepository {
    static create(participationId, candidateId) {
        return new Promise((resolve, reject) => {
            mysql.execute(
                "INSERT INTO vote VALUES (default,?,?,default)",
                [participationId, candidateId],
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
                "SELECT * FROM vote WHERE participation_id = ?",
                [participationId],
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                }
            );
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
                            else if (themeResult.length === 0) reject(new Error("No themes created by this user"));
                            else {
                                const themeIds = themeResult.map(t => t.id);
                                mysql.execute(
                                    "SELECT id FROM elections WHERE id = ? AND theme_id IN (?)",
                                    [electionId, themeIds], (err, electionResult) => {
                                        if (err) reject(err);
                                        else if (electionResult.length === 0) reject(new Error("Election not found or not owned"));
                                        else {
                                            mysql.execute(
                                                "SELECT id FROM participation WHERE election_id = ?",
                                                [electionId], (err, participationResult) => {
                                                    if (err) reject(err);
                                                    else if (participationResult.length === 0) reject(new Error("No votes found"));
                                                    else {
                                                        const participationIds = participationResult.map(p => p.id);
                                                        mysql.execute(
                                                            "SELECT * FROM vote WHERE participation_id IN (?)",
                                                            [participationIds], (err, votesResult) => {
                                                                if (err) reject(err);
                                                                else resolve(votesResult);
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
                            else if (participationResult.length === 0) reject(new Error("User has not participated in this election"));
                            else {
                                mysql.execute(
                                    "SELECT * FROM vote WHERE participation_id = ?",
                                    [participationResult[0].id], (err, votesResult) => {
                                        if (err) reject(err);
                                        else resolve(votesResult);
                                    }
                                );
                            }
                        }
                    );
                    break;

                default:
                    reject(new Error("Invalid user role"));
            }
        });
    }

    static checkExistingVote(participationId) {
        return new Promise((resolve, reject) => {
            mysql.execute(
                "SELECT id FROM vote WHERE participation_id = ?",
                [participationId],
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result.length > 0);
                }
            );
        });
    }

    static getCandidateParticipation(candidateId) {
        return new Promise((resolve, reject) => {
            mysql.execute(
                "SELECT participation_id FROM candidates WHERE id = ?",
                [candidateId],
                (err, result) => {
                    if (err) reject(err);
                    else if (result.length === 0) reject(new Error("Candidate not found"));
                    else resolve(result[0].participation_id);
                }
            );
        });
    }

    static getElectionFromParticipation(participationId) {
        return new Promise((resolve, reject) => {
            mysql.execute(
                "SELECT election_id FROM participation WHERE id = ?",
                [participationId],
                (err, result) => {
                    if (err) reject(err);
                    else if (result.length === 0) reject(new Error("Participation not found"));
                    else resolve(result[0].election_id);
                }
            );
        });
    }

    static updateParticipationStatus(participationId, status) {
        return new Promise((resolve, reject) => {
            mysql.execute(
                "UPDATE participation SET status = ? WHERE id = ?",
                [status, participationId],
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                }
            );
        });
    }
}