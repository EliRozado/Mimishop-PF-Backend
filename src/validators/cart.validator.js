import { CartService, ProductService } from "../repository/index.repository.js";
import AppException from '../utils/customErrors/AppException.js'
import TicketValidator from "./ticket.validator.js";

class CartValidator{
    async createCart(){
        const cart = await CartService.createCart()
        return cart
    };

    async getCartByID(cid){
        if(!cid) {
            throw new AppException('REQUIRED DATA', 'Product ID is required.', 400)
        };

        const cart = await CartService.getCartByID(cid);
        return cart;
    }

    async addProductToCart(cid, list, user){
        const products = list;

        if(!cid) {
            throw new AppException('REQUIRED DATA', 'Product ID is required.', 400)
        };

        if(!products.length){
            throw new AppException('REQUIRED DATA', 'There are no products to add to the cart.', 400)
        };

        products.forEach( async (item) => {
            let {product, quantity} = item;
            

            if(quantity && isNaN(quantity)) {
                throw new AppException('BAD REQUEST', 'Quantity must be a number', 400);
            };

            // -- checks existance of product in the database
            const productInfo = await ProductService.getProductByID(product);
            
            if(productInfo.owner == user.email){
                throw new AppException('UNAUTHORIZED', 'The owner of a product cannot buy its own product', 401);
            }

            // -- if the product exist in the cart, it adds quantity to it
            const cart = await CartService.findProductInCart(cid, product);
            if(cart){
                const addProduct = await CartService.addQuantityToProductInCart(cid, product, quantity || 1)
            }else{
                const addProduct = await CartService.addProductToCart(cid, product, quantity || 1)
            }     
        })
        const final_cart = await CartService.getCartByID(cid)
        return {status: 'SUCCESSFUL', cart: final_cart};
    };

    async addQuantityToProduct(cid, pid, quantity){
        // -- if the product exist in the cart
        const cart = await CartService.findProductInCart(cid, pid);

        if(quantity && isNaN(quantity)) {
            throw new AppException('BAD REQUEST', 'Quantity must be a number', 400);
        };

        const addProduct = await CartService.addQuantityToProductInCart(cid, pid, quantity)
        return {status: 'SUCCESSFUL', cart: addProduct};
    }

    async deleteProductFromCart(cid, pid){
        if(!cid || !pid){
            throw new AppException('REQUIRED DATA', 'Cart ID & Product ID are required.', 400)
        }

        const cart = await CartService.deleteProduct(cid, pid);
        return {status: 'SUCCESSFUL', cart: cart}
    }

    async emptyCart(cid){
        if(!cid){
            throw new AppException('REQUIRED DATA', 'Cart ID is required.', 400)
        }

        const cart = await CartService.deleteAllProducts(cid);
        return {status: 'SUCCESSFUL', cart: cart};
    }

    async completePurchase(req){
        const id = req.params.id;
        const user = req.user;

        let processed = []
        let notProcessed = []
        let total = 0;

        if(!id) { throw new AppException('REQUIRED DATA', 'Cart ID is required.', 400) };

        const purchaser = user.email;

        let cart = await CartService.getCartByID(id);
        if(!cart.products.length) { throw new AppException('CART IS EMPTY', 'Cart is empty', 400) };

        

        // -- processing the cart products
        /*let processProducts = new Promise((resolver, reject) => {
            cart.products.forEach( (item) => {
                
                if(item.quantity <= item.product.stock){
                    // -- if enough stock
                    
                    let updatedStock = item.product.stock - item.quantity;
                    await ProductService.updateProduct(item.product.id, {stock: updatedStock})
    
                    let price = item.quantity*item.product.price;
    
                    totalArray.push(price);
                    // -- delete product from the cart
                    await CartService.deleteProduct(id, item.product.id);
    
                }else{
                    // *- not enough stock
                    notProcessed.push(item.product.id)
                };
            })
        }).then(()=>{ 
            for (const i of totalArray) {
                total += totalArray[i]
            }
        })*/
/*
        cart.products.forEach( async (item) => {
            console.log(item)
            
            if(item.quantity <= item.product.stock){
                // -- if enough stock
                
                let updatedStock = item.product.stock - item.quantity;
                await ProductService.updateProduct(item.product.id, {stock: updatedStock})

                let price = item.quantity*item.product.price;

                totalArray.push(price);
                // -- delete product from the cart
                await CartService.deleteProduct(id, item.product.id);

            }else{
                // *- not enough stock
                notProcessed.push(item.product.id)
            };
        })*/
        
        console.log(totalArray, total)
        

        console.log('total:' +total)
        if( total === 0 ){
            return {status: 'UNSUCCESSFUL', message: "The purchase couldn't be completed due to limited stock of the items selected."};
        }

        let ticket = await TicketValidator.createTicket({total: total, purchaser});

        if(notProcessed.length){
            return {status: 'PARTLY SUCCESSFUL', message:'Some products were not processed due to limited stock, try again another time or contact the sellers directly!', ticket: ticket, notProcessed: notProcessed}
        }

        return {status: 'SUCCESSFUL', message: 'Purchase submitted', ticket: ticket, notProcessed: notProcessed};
    }
    
}

export default new CartValidator();