import { Router } from 'express';
import cartsRoutes from './cart.routes.js';
// import mockRoutes from './mock.routes.js';
import productsRoutes from './product.routes.js';
import sessionRoutes from './session.routes.js';
import userRoutes from './user.routes.js';
import viewsRouter from './views.routes.js';

const router = Router();

router.use('/api/products', productsRoutes);
router.use('/api/cart', cartsRoutes);
router.use('/session', sessionRoutes);
router.use('/api/user', userRoutes);
router.use('/', viewsRouter);
/*router.use('/mockingproducts', mockRoutes);*/

router.get('*', (req, res) => { res.status(404).redirect('/404')})

export default router;