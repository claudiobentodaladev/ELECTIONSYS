import mongoose, { model as createCollection } from "mongoose";

const userSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.BigInt,
        required: true,
        unique: true
    },
    name: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    surname: {
        type: mongoose.Schema.Types.String,
        required: false
    },
    sex: {
        type: mongoose.Schema.Types.String,
        enum: ["M","F"],
        required: false
    },
    born_date: {
        type: mongoose.Schema.Types.Date,
        required: false
    },
    photo_url: {
        type: mongoose.Schema.Types.String,
        required: false
    }
});

export const Profile = createCollection("profile", userSchema);