import mongoose, { model as createCollection } from "mongoose";

const preferencesSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.BigInt,
        required: true,
        unique: true
    },
    theme: {
        type: mongoose.Schema.Types.String,
        enum: ["LIGHT","DARK"],
        required: true
    }
});

export const Preferences = createCollection("preferences", preferencesSchema);