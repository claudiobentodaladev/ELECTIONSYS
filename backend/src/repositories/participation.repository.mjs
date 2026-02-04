import mysql from "../config/database/mysql/db.connection.mjs";

export class ParticipationRepository {
    static create(userId, electionId) {
        return new Promise((resolve, reject) => {
            mysql.execute(
                "INSERT INTO participation VALUES (default,?,?,default)",
                [userId, electionId],
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                }
            );
        });
    }

    static findByUserAndElection(userId, electionId) {
        return new Promise((resolve, reject) => {
            mysql.execute(
                "SELECT * FROM participation WHERE user_id = ? AND election_id = ?",
                [userId, electionId],
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
                "SELECT * FROM participation WHERE id = ?",
                [id],
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                }
            );
        });
    }

    static findByUserId(userId) {
        return new Promise((resolve, reject) => {
            mysql.execute(
                "SELECT * FROM participation WHERE user_id = ?",
                [userId],
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                }
            );
        });
    }
}