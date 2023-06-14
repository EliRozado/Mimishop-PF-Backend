import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    password: { type: String, required: true },
    last_connection: {type: Date, required: true},
    documents: [
        {
            name: {type: String},
            reference: {type: String}
        }
    ],
    carts: [
        {
            cart: {type: Schema.Types.ObjectId, ref: 'carts'}
        }
        
    ],
    role: { type: String, required: true, default: 'user' },
})

export const userModel = model('users', userSchema);