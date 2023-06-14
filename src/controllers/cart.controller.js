import CartValidator from "../validators/cart.validator.js";
import { MongoErrorHandler } from "../utils/customErrors/mongoErrors.js";

class CartController{
    async createCart(req, res){
        try{
            const cart = await CartValidator.createCart();
            res.status(200).json({status: 'SUCCESSFUL', cart: cart});
        } catch (err) {
            let error = MongoErrorHandler(err) || err;

            if(!err.status){
                return res.status(500).json({ error: 'UNHANDLED ERROR', message: err.message})
            }

            res.status(error.status).json({ error: error.name, message: error.message });
        }
    }

    async getCartById(req, res){
        try{
            const cart = await CartValidator.getCartByID(req.params.id);
            res.status(200).json({status: 'SUCCESSFUL', cart: cart});
        } catch (err) {
            if(!err.status){
                return res.status(500).json({ error: 'UNHANDLED ERROR', message: err.message})
            }
            let error = MongoErrorHandler(err) || err;

            if(!err.status){
                return res.status(500).json({ error: 'UNHANDLED ERROR', message: err.message})
            }

            res.status(error.status).json({ error: error.name, message: error.message });
        }
    }

    async addProductToCart(req, res){
        try{
            const cart = await CartValidator.addProductToCart(req.params.id, req.body, req.user);
            res.status(200).json(cart);
        } catch (err) {
            let error = MongoErrorHandler(err) || err;

            if(!err.status){
                return res.status(500).json({ error: 'UNHANDLED ERROR', message: err.message})
            }

            res.status(error.status).json({ error: error.name, message: error.message });
        }
    }

    //pending
    async addProductQuantityToCart(req, res){
        try{
            const { id, pid } = req.params;
            const quantity = req.body.quantity;

            const cart = await CartValidator.addQuantityToProduct(id, pid, quantity);
            res.status(200).json(cart);
        } catch (err) {
            let error = MongoErrorHandler(err) || err;

            if(!err.status){
                return res.status(500).json({ error: 'UNHANDLED ERROR', message: err.message})
            }

            res.status(error.status).json({ error: error.name, message: error.message });
        }
    }

    async deleteProductFromCart(req, res){
        try{
            const cart = await CartValidator.deleteProductFromCart(req.params.cid, req.params.pid);
            res.status(200).json(cart);
        } catch (err) {
            let error = MongoErrorHandler(err) || err;

            if(!err.status){
                return res.status(500).json({ error: 'UNHANDLED ERROR', message: err.message})
            }

            res.status(error.status).json({ error: error.name, message: error.message });
        }
    }

    async deleteAllProductsFromCart(req, res){
        try{
            const cart = await CartValidator.emptyCart(req.params.id);
            res.status(200).json(cart);
        } catch (err) {
            let error = MongoErrorHandler(err) || err;

            if(!err.status){
                return res.status(500).json({ error: 'UNHANDLED ERROR', message: err.message})
            }

            res.status(error.status).json({ error: error.name, message: error.message });
        }        
    }

    async completePurchase(req, res){
        try{
            const cart = await CartValidator.completePurchase(req);
            res.status(200).json(cart);
        } catch (err) {
            console.log(err)
            let error = MongoErrorHandler(err) || err;

            if(!err.status){
                return res.status(500).json({ error: 'UNHANDLED ERROR', message: err.message})
            }

            res.status(error.status).json({ error: error.name, message: error.message });
        }        
    }
}

export default new CartController();