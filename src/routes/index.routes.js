import { Router } from 'express';
import cartsRoutes from './cart.routes.js';
// import chatRoutes from './chat.routes.js';
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
/*router.use('/chat', chatRoutes);
router.use('/mockingproducts', mockRoutes);

router.get('/loggerTest', (req, res) => {
    req.logger.fatal('This is fatal!')
    req.logger.error('This one is an error');
    req.logger.warning('Just giving you a warning');
    req.logger.info('There was a cat around here before')
    req.logger.debug("I'm the last one, the http message should be the first one in the line")
    res.status(200).send({message: 'The colours of the rainbow'})
})
*/
router.get('*', (req, res) => { res.status(404).send('404 not found')})

export default router;