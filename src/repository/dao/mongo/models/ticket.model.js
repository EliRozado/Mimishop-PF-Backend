import { Schema, model } from 'mongoose';

// -- Generate a ticket code
const ticketCollection = 'tickets'

const ticketSchema = new Schema({
    code: { type: String, auto: true, unique: true, default: () => {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const charactersLength = characters.length;
        const n = 6;
    
        for (let i = 0; i < n; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength))
        };
        
        return result;
    }},
    purchase_datetime: {type: Date, required: true},
    amount: { type: Number, required: true },
    purchaser: {type: String, required: true}
})

export const ticketModel = model(ticketCollection, ticketSchema);
