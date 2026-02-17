import { checkSchema, body } from "express-validator";

export const passwordValidator = [
    body().custom((_, { req }) => {

        if (!req.body) throw new Error("O body está vazio");

        const { current_password, new_password } = req.body;

        if (current_password === new_password) throw new Error("New password can'nt be the same than current password");

        return true;
    })
]

export const passwordSchema = checkSchema({
    "current_password": {
        in: ["body"],
        notEmpty: { errorMessage: "current password is required" },
        isLength: {
            options: { min: 6 },
            errorMessage: "current Password must be length with 6 character"
        }
    },

    "new_password": {
        in: ["body"],
        notEmpty: { errorMessage: "new password is required" },
        isLength: {
            options: { min: 6 },
            errorMessage: "New password must be length with 6 character"
        }
    }
});