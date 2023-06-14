import { Router } from 'express';
import { generateProduct } from '../utils/mocks/product.mock.js';

const router = Router();

// -- get all products // mock
router.get('/', (req, res) => {
    //generar 100 productos, con la misma estructura del servidor de mongo
    const products = [];
    for(let i=0; i<100; i++){
        products.push(generateProduct())
    }

    res.status(200).json(products);
}); 

export default router;