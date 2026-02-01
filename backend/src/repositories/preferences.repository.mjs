import { Preferences } from "../database/mongodb/schema/preferences.schema.mjs";

export class PreferencesRepository {
    static findByUserId(userId) {
        return new Promise((resolve, reject) => {
            Preferences.findOne({ user_id: userId })
                .then(preferences => resolve(preferences))
                .catch(err => reject(err));
        });
    }

    static updateTheme(userId, newTheme) {
        return new Promise((resolve, reject) => {
            Preferences.updateOne({ user_id: userId }, { $set: { theme: newTheme } })
                .then(result => resolve(result))
                .catch(err => reject(err));
        });
    }
}