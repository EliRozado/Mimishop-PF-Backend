import { Router } from 'express';
import { canAccess } from '../middleware/access.js'
import { passportCall } from '../utils/sessionUtils.js';
import CartController from '../controllers/cart.controller.js';

const router = Router();

// -- create a cart
router.post('/', CartController.createCart);

// -- get cart by ID
router.get('/:id', CartController.getCartById);

// -- add a product to cart
router.put('/:id', passportCall('current'), canAccess(['user', 'premium']), CartController.addProductToCart);

// -- add a quantity of a product to a cart
router.put('/:id/product/:pid', passportCall('current'),  canAccess(['user', 'premium']),CartController.addProductQuantityToCart);

// -- delete a product from cart
router.delete('/:cid/product/:pid', CartController.deleteProductFromCart);

// -- delete ALL products from cart
router.delete('/:id', CartController.deleteAllProductsFromCart);

// -- complete the cart purchase
router.get('/:id/purchase', passportCall('current'), CartController.completePurchase)

export default router;