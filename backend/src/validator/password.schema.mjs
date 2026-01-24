import { checkSchema, body } from "express-validator";

export const passwordValidator = [
    body().custom((_, { req }) => {

        if (!req.body) throw new Error("O body está vazio");

        const { password, newPassword } = req.body;

        if (password === newPassword) throw new Error("New password can'nt be the same than current password");

        return true;
    })
]

export const passwordSchema = checkSchema({

    "password": {
        in: ["body"],
        notEmpty: { errorMessage: "password is required" },
        isLength: {
            options: { min: 6 },
            errorMessage: "Password must be length with 6 character"
        }
    },

    "newPassword": {
        in: ["body"],
        notEmpty: { errorMessage: "new password is required" },
        isLength: {
            options: { min: 6 },
            errorMessage: "New password must be length with 6 character"
        },
    }
});