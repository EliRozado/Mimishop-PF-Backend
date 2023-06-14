import ProductValidator from "../validators/product.validator.js";
import { MongoErrorHandler } from "../utils/customErrors/mongoErrors.js";

class ProductsController{
    async getAllProducts(req ,res){
        try{
            const products = await ProductValidator.getProducts(req.query);

            res.status(200).json(products);
        }catch(err){
            let error = MongoErrorHandler(err) || err;

            if(!err.status){
                return res.status(500).json({ error: 'UNHANDLED ERROR', message: err.message})
            }

            res.status(error.status).json({ error: error.name, message: error.message });
        }
    }
    
    async getProductByID(req, res){
        try{
            const product = await ProductValidator.getProductByID(req.params.id);

            res.status(200).json(product);
        }catch(err){
            let error = MongoErrorHandler(err) || err;

            if(!err.status){
                return res.status(500).json({ error: 'UNHANDLED ERROR', message: err.message})
            }

            res.status(error.status).json({ error: error.name, message: error.message });
        }
    }

    async addProduct(req, res){
        try{
            const product = await ProductValidator.createProduct(req);

            res.status(200).json({status: "SUCCESSFUL", result: product})
        }catch(err){
            let error = MongoErrorHandler(err) || err;

            if(!err.status){
                return res.status(500).json({ error: 'UNHANDLED ERROR', message: err.message})
            }
            
            res.status(error.status).json({ error: error.name, message: error.message });
        }
    }

    async editProduct(req, res){
        try{
            const product = await ProductValidator.updateProduct(req.params.id, req);
            
            res.status(200).json({status: "SUCCESSFUL", result: product});
        }catch(err){
            let error = MongoErrorHandler(err) || err;

            if(!err.status){
                return res.status(500).json({ error: 'UNHANDLED ERROR', message: err.message})
            }
            
            res.status(error.status).json({ error: error.name, message: error.message });
        }
    }

    async deleteProduct(req, res){
        try{
            const product = await ProductValidator.deleteProduct(req.params.id, req.user);

            res.status(200).json({status: 'SUCCESSFUL', message: 'Product was successfully deleted', product});
        }catch(err){
            let error = MongoErrorHandler(err) || err;

            if(!err.status){
                return res.status(500).json({ error: 'UNHANDLED ERROR', message: err.message})
            }
            
            res.status(error.status).json({ error: error.name, message: error.message });
        }
    }
}

export default new ProductsController();