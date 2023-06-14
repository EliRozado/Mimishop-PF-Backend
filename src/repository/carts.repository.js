export default class CartsRepository{
    constructor(dao){
        this.dao = dao;
    }

    createCart(){
        return this.dao.create({});
    }

    getCartByID(id){
        return this.dao.getByID(id);
    }

    findProductInCart(cid, pid){
        return this.dao.findProduct(cid, pid)
    }

    addProductToCart(cid, pid, qty){
        return this.dao.addProduct(cid, {product: pid, quantity: qty})
    }

    addQuantityToProductInCart(cid, pid, qty){
        return this.dao.addQuantity(cid, pid, qty)
    }

    deleteProduct(cid, pid){
        return this.dao.deleteProduct(cid, pid)
    }

    deleteAllProducts(cid){
        return this.dao.deleteAllProducts(cid);
    }
}