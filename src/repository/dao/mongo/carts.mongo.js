import { cartModel } from "./models/cart.model.js";

class CartDao {
    create(){
        return cartModel.create({});
    }

    getByID(id){
        return cartModel.findById({_id: id}).populate('products.product');
    }

    findProduct(cid, pid){
        return cartModel.findOne({_id: cid, 'products.product': pid})
    }

    addProduct(cid, data){
        return cartModel.findByIdAndUpdate({_id: cid}, {$push: {products: data}}, {new: true})
    }

    addQuantity(cid, pid, qty){
        return cartModel.findOneAndUpdate({_id: cid, "products.product": pid}, {$inc: {"products.$.quantity": qty}},{new: true})
    }

    deleteProduct(cid, pid){
        return cartModel.findOneAndUpdate({_id: cid}, {$pull: {products: {product: pid}}}, { safe: true, multi: false })
    }

    deleteAllProducts(cid){
        return cartModel.findOneAndReplace({_id: cid}, {products: []});
    }
}

export default new CartDao();