import { ProductService } from "../repository/index.repository.js";
import AppException from '../utils/customErrors/AppException.js'
import { deletedProduct } from "../config/mailing.config.js";
import fs from 'fs/promises';

class ProductValidator{
    async getProducts(filters){
        const sortValidValues = [-1, 1, '-1', '1'];
        let query = {};

        // Obtain data from req.query
        const { page, limit, sort, category, status } = filters;

        // Check that the data is valid
        if( category || status ){
            query = { category } || { status }
        };

        if(limit && ( isNaN(limit) || limit <= 0 )) {
            throw new AppException('INVALID VALUE', 'Limit must be a number over 0', 400)
        };

        if(page && ( isNaN(page) || page <=0 ) ){
            throw new AppException('INVALID VALUE', 'Page must be a number over 0', 400)
        };

        const options = {page: parseInt(page) || 1, limit: parseInt(limit) || 10};

        // if sorting for price is added, check if it's valid
        if(sortValidValues.includes(sort)){
            options.sort = { price: sort }
            return await ProductService.getAllProducts(query, options)
        }else{
            if(sort){
                throw new AppException('INVALID VALUE', 'Sort values can only be 1 or -1', 400)
            }
        };

        const products = await ProductService.getAllProducts( query, options );
        return products;
    }

    async getProductByID(pid){
        const id = pid;
        
        if(!id) {
            throw new AppException('REQUIRED DATA', 'Product ID is required.', 400)
        }

        const product = await ProductService.getProductByID(pid)
        return product;
    };

    async createProduct(req){
        let owner;
        let thumbnails = [];

        console.log(req.body)

        if(req.user.role == 'premium') {
            owner = req.user.email
        }else if(req.user.role == 'admin') owner = 'admin'

        const {title, description, price, status=true, stock, category} = req.body;

        if( !title || !description || !price || typeof status != 'boolean' || !stock || !category ) {
            throw new AppException('MISSING FIELDS', 'Missing required fields', 400)
        };

        
        if(req.files){ if(req.files.length){
            req.files.forEach(img => {
                thumbnails.push(img.path)
            });
        }}

        const product = ProductService.createProduct({title, description, owner, price, stock, status, category, thumbnails});
        return product;
    }

    async updateProduct(pid, data){
        const {title, description, price, stock, category} = data.body;

        console.log(data.body)

        if(!pid){
            throw new AppException('REQUIRED DATA', 'Product ID is required.', 400)
        };

        // if the product doesn't exist, it'll throw an exception
        const productInfo = await ProductService.getProductByID(pid);   
        
        if(data.user.role != 'admin') if(productInfo.owner != data.user.email){
            throw new AppException('FORBIDDEN', 'Only the admin or owner of this product can edit its information', 403)
        }

        const product = await ProductService.updateProduct(pid, {title, description, price, stock, category});

        return product;
    }

    async deleteProduct(pid, user){
        // const user = req.user;

        if(!pid){
            throw new AppException('REQUIRED DATA', 'Product ID is required.', 400)
        };

        // if the product doesn't exist, it'll throw an exception
        const productInfo = await ProductService.getProductByID(pid);

        if(user.role != 'admin') if(productInfo.owner != user.email){
            throw new AppException('FORBIDDEN', 'Only the admin or owner of this product can delete it', 403)
        }

        if(productInfo.thumbnails.length){
            productInfo.thumbnails.forEach((img) => {
                fs.unlink((img))
            })
        };

        const email = await deletedProduct(productInfo);

        const product = await ProductService.deleteProduct(pid);

        return product;
    }
}

export default new ProductValidator();