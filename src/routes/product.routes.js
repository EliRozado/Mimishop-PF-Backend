import { Router } from 'express';
import { canAccess } from '../middleware/access.js'
import { passportCall } from '../utils/sessionUtils.js';
import ProductController from '../controllers/products.controller.js';
import { uploadProductImage } from '../middleware/multerUpload.js';


const router = Router();

// -- get all products
router.get('/', ProductController.getAllProducts); 

// -- get a product by ID
router.get('/:id', ProductController.getProductByID);

// -- add a new product
router.post('/', passportCall('current'), canAccess(['admin', 'premium']), uploadProductImage.array('thumbnail'), ProductController.addProduct);

// -- edit a product information
router.put('/:id', passportCall('current'), canAccess(['admin', 'premium']), ProductController.editProduct);

// -- delete a product from the list
router.delete('/:id', passportCall('current'), canAccess(['admin', 'premium']), ProductController.deleteProduct);

export default router;