import mysql from "../config/database/mysql/db.connection.mjs";

export class ThemeRepository {
    static create(userId, data) {
        return new Promise((resolve, reject) => {
            mysql.execute(
                "INSERT INTO theme VALUES (default,?,?,?,?)",
                [userId, data.photo_election_url, data.name, data.description],
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
                "SELECT * FROM theme WHERE user_id = ?",
                [userId],
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                }
            );
        });
    }

    static findByIdAndUserId(id, userId) {
        return new Promise((resolve, reject) => {
            mysql.execute(
                "SELECT * FROM theme WHERE id = ? AND user_id = ?",
                [id, userId],
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

            if (data.photo_election_url !== undefined) {
                updates.push("photo_election_url = ?");
                values.push(data.photo_election_url);
            }
            if (data.name !== undefined) {
                updates.push("name = ?");
                values.push(data.name);
            }
            if (data.description !== undefined) {
                updates.push("description = ?");
                values.push(data.description);
            }

            if (updates.length === 0) {
                resolve({ affectedRows: 0 });
                return;
            }

            const updateQuery = `UPDATE theme SET ${updates.join(", ")} WHERE id = ?`;
            values.push(id);

            mysql.execute(updateQuery, values, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }
}