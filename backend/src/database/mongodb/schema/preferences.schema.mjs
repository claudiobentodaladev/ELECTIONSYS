import mongoose, { model as createCollection } from "mongoose";

const preferencesSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.BigInt,
        required: true,
        unique: true
    },
    private: {
        type: mongoose.Schema.Types.Boolean,
        required: true
    },
    theme: {
        type: mongoose.Schema.Types.Boolean,
        required: true
    }
});

export const Preferences = createCollection("preferences", preferencesSchema);