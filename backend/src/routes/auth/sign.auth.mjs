import { Router } from "express";
import mysql from "../../database/mysql/db.connection.mjs";
import { Profile } from "../../database/mongodb/schema/user.schema.mjs";
import { hashPassword } from "../../utils/hashPassword.mjs";
import { notAuthenticated } from "../../middleware/notAuthenticated.middleware.mjs";
import { signUser } from "../../utils/response.class.mjs";

const router = Router();

router.post("/", notAuthenticated, async (req, res) => {
  try {
    const { email, password, role, profile } = req.body;

    mysql.execute(
      "insert into users values(default,?,?,?,default)",
      [email, hashPassword(password), role], async (err, result) => {
        if (err) return res.status(400).json(
          new signUser(err.message).error()
        );

        const baseProfile = {
          user_id: result.insertId,
          name: profile.name,
          photo_url: profile.photo_url
        };

        if (role === "eleitor") Object.assign(baseProfile, {
          surname: profile.surname,
          sex: profile.sex,
          born_date: profile.born_date
        });

        await Profile.insertOne(baseProfile);

        return res.status(201).json(
          new signUser().ok({
            user: { email, role },
            profile: baseProfile
          })
        );
      }
    );
  } catch (err) {
    return res.status(500).json(
      new signUser(err.message).error()
    );
  }
});

export default router;
