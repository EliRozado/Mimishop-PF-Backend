import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productCollection = 'products'

const productSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    owner: { type: String, default: 'admin' },
    code: { type: String, auto: true, unique: true, default: () => {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const charactersLength = characters.length;
        const n = 6;
    
        for (let i = 0; i < n; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength))
        };
        
        return result;
    } },
    price: { type: Number, required: true },
    status: { type: Boolean,  default: true, index: true},
    stock: { type: Number, required: true },
    category: { type: String, required: true, index: true },
    thumbnails: {type: Array }
})

productSchema.plugin(mongoosePaginate);

export const productModel = model(productCollection, productSchema);
