import { Router } from "express";
import mysql from "../../database/mysql/db.connection.mjs";
import { Profile } from "../../database/mongodb/schema/user.schema.mjs";
import { Preferences } from "../../database/mongodb/schema/preferences.schema.mjs";
import { hashPassword } from "../../utils/hashPassword.mjs";
import { notAuthenticated } from "../../middleware/notAuthenticated.middleware.mjs";
import { apiResponse } from "../../utils/response.class.mjs";

const router = Router();

router.post("/", notAuthenticated, async (request, response) => {
  try {
    const { username, email, password, role, profile } = request.body;

    mysql.execute(
      "INSERT INTO users VALUES(DEFAULT,?,?,?,DEFAULT)",
      [email, hashPassword(password), role], async (err, result) => {
        if (err) return response.status(400).json(
          new apiResponse(err.message).error(err)
        );

        const baseProfile = {
          user_id: result.insertId,
          username: username,
          name: profile.name,
          photo_url: profile.photo_url
        };

        if (role === "eleitor") Object.assign(baseProfile, {
          surname: profile.surname,
          sex: profile.sex,
          born_date: profile.born_date
        });

        await Profile.insertOne(baseProfile);
        await Preferences.insertOne({
          user_id: result.insertId,
          theme: "LIGHT"
        })

        return response.status(201).json(
          new apiResponse("created the user account").ok({
            user: { email, role },
            profile: { baseProfile }
          })
        );
      }
    );
  } catch (err) {
    return response.status(500).json(
      new apiResponse(err.message).error(true)
    );
  }
});

export default router;
