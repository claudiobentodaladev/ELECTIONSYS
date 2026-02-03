import { Profile } from "../database/mongodb/schema/user.schema.mjs";

export class ProfileRepository {
    static create(data) {
        return new Promise((resolve, reject) => {
            Profile.insertOne(data)
                .then(profile => resolve(profile))
                .catch(err => reject(err));
        });
    }

    static findByUserId(userId) {
        return new Promise((resolve, reject) => {
            Profile.findOne({ user_id: userId })
                .then(profile => resolve(profile))
                .catch(err => reject(err));
        });
    }

    static updateByUserId(userId, updateData) {
        return new Promise((resolve, reject) => {
            Profile.updateOne({ user_id: userId }, { $set: updateData }, { new: true })
                .then(result => resolve(result))
                .catch(err => reject(err));
        });
    }
}