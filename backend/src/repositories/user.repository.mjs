import mysql from "../database/mysql/db.connection.mjs";

export class UserRepository {
    static create(data) {
        return new Promise((resolve, reject) => {
            mysql.execute(
                "INSERT INTO users VALUES (default,?,?,?,default)",
                [data.email, data.password, data.role],
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                }
            );
        });
    }

    static findByEmail(email) {
        return new Promise((resolve, reject) => {
            mysql.execute(
                "SELECT * FROM users WHERE email = ?",
                [email],
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
                "SELECT * FROM users WHERE id = ?",
                [id],
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

            if (data.name !== undefined) {
                updates.push("name = ?");
                values.push(data.name);
            }
            if (data.email !== undefined) {
                updates.push("email = ?");
                values.push(data.email);
            }
            if (data.password_hash !== undefined) {
                updates.push("password_hash = ?");
                values.push(data.password_hash);
            }
            if (data.photo_url !== undefined) {
                updates.push("photo_url = ?");
                values.push(data.photo_url);
            }

            if (updates.length === 0) {
                resolve({ affectedRows: 0 });
                return;
            }

            const updateQuery = `UPDATE users SET ${updates.join(", ")} WHERE id = ?`;
            values.push(id);

            mysql.execute(updateQuery, values, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }
}