import passport from "passport";
import { Strategy } from "passport-local";
import mysql from "../database/mysql/db.connection.mjs";
import { comparePassword } from "../utils/hashPassword.mjs";

passport.serializeUser(({ id }, done) => {
    try {
        done(null, id)
    } catch (err) {
        done(err)
    }
});

passport.deserializeUser((id, done) => {
    try {
        mysql.execute("select id,email,password_hash,role from users where id = ?;", [id], (err, result) => {
            if (err) throw new Error(err);
            if (result.length === 0) return done(null, false);

            const [user] = result;

            done(null, user)
        })
    } catch (err) {
        done(err)
    }
});

export default passport.use(new Strategy({
    usernameField: "email",
    passwordField: "password"
}, (email, password, done) => {
    try {
        mysql.execute("select id,email,password_hash,role from users where email = ?;", [email], (err, result) => {
            if (err) throw new Error(err);
            if (result.length === 0) return done(null, false, { message: "user not found!" }); // get better with class response
            else {
                const [user] = result;

                if (!comparePassword(password, user.password_hash)) return done(null, false, { message: "Invalid password!" });

                done(null, user)
            }
        })
    } catch (err) {
        done(err)
    }
}));