import mysql from "../config/database/mysql/db.connection.mjs";

export class ElectionRepository {
    static create(themeId, startDate, endDate) {
        return new Promise((resolve, reject) => {
            mysql.execute(
                "INSERT INTO elections VALUES (default,?,?,?,default)",
                [themeId, startDate, endDate],
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
                "SELECT * FROM elections WHERE id = ?",
                [id],
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                }
            );
        });
    }

    static findByThemeId(themeId) {
        return new Promise((resolve, reject) => {
            mysql.execute(
                "SELECT * FROM elections WHERE theme_id = ?",
                [themeId],
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                }
            );
        });
    }

    static update(id, startDate, endDate) {
        return new Promise((resolve, reject) => {
            mysql.execute(
                "UPDATE elections SET start_at = ?, end_at = ? WHERE id = ?",
                [startDate, endDate, id],
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                }
            );
        });
    }

    static findOverlapping(themeId, startDate, endDate, excludeId = null) {
        return new Promise((resolve, reject) => {
            let query = "SELECT id FROM elections WHERE theme_id = ? AND id != ? AND ((start_at <= ? AND end_at >= ?) OR (start_at <= ? AND end_at >= ?) OR (start_at >= ? AND end_at <= ?))";
            let params = [themeId, excludeId || 0, startDate, startDate, endDate, endDate, startDate, endDate];
            mysql.execute(query, params, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }
}