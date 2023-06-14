import { Schema, model } from 'mongoose';

const pwdRecoveryCollection = 'pwdRecover'

const pwdRecoverySchema = new Schema({
    user: { type: String, required: true },
    expireAt: {
        type: Date,
        default: Date.now,
        expires: 3600,
    }
})

export const pwdRecoveryModel = model(pwdRecoveryCollection, pwdRecoverySchema);
