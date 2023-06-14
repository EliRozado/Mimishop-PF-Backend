import { Router } from "express";
import { passportCall } from '../utils/sessionUtils.js';
import { canAccess } from "../middleware/access.js";
import { userDTO} from "../repository/dto/users.dto.js";
import ProductValidator from "../validators/product.validator.js";
import PasswordRecoveryValidator from "../validators/pwdRecovery.validator.js";
import cartValidator from "../validators/cart.validator.js";
import userValidator from "../validators/user.validator.js";

const router = Router();

router.get('/', (req, res) => {
    res.redirect('/login')
})

router.get('/login', async (req, res) => {    
    res.render('login')
})

router.get('/register', async (req, res) => {    
    res.render('register')
})
router.get('/registerSuccess', async (req, res) => {    
    res.render('registerSuccess')
})


router.get('/products', passportCall('current'), async (req, res) => {
    if (!req.user) {
        return res.redirect('/login')
    }

    const products = await ProductValidator.getProducts(req.query)
    const user = userDTO(req.user)

    // -- helpers for handlebars template
    const isPremium = user.role == "premium"
    const isUser = user.role == "user"
    const isAdmin = user.role == "admin"
    
    res.render('products', { products, user, isPremium, isUser, isAdmin })
})

router.get('/products/:id', passportCall('current'), async (req, res) => {
    if (!req.user) {
        return res.redirect('/login')
    }
    
    const product = await ProductValidator.getProductByID(req.params.id)

    const isOwner = product.owner == req.user.email || req.user.role == 'admin';
    
    res.render('productDetails', { product, cart: req.user.cart, isOwner})
})

router.get('/carts/:cid', passportCall('current'), async (req,res) => {
    if (!req.user) {
        return res.redirect('/login')
    }

    const cart = await cartValidator.getCartByID(req.params.cid)

    const user = req.user.user_id;

    res.render('cart', { cart, user })
})

router.get('/user/:uid', passportCall('current'), async (req,res) => {
    if (!req.user) {
        return res.redirect('/login')
    }

    const user = await userValidator.getUserById(req.params.uid);

    // -- helpers for handlebars template
    const isPremium = user.role == "premium"
    const isUser = user.role == "user"
    const isAdmin = user.role == "admin"

    res.render('profile', { user, isPremium, isUser, isAdmin  })
})

router.get('/addProduct', passportCall('current'), canAccess(['premium', 'admin']), async (req, res) => {
    if (!req.user) {
        return res.redirect('/login')
    }
    const user = req.user;

    // -- helpers for handlebars template
    const isPremium = user.role == "premium"
    const isAdmin = user.role == "admin"

    res.render('newProduct', { user, isPremium, isAdmin  })
})

router.get('/products/edit/:id', passportCall('current'), canAccess(['premium', 'admin']), async (req, res) => {
    if (!req.user) {
        return res.redirect('/login')
    }
    
    const product = await ProductValidator.getProductByID(req.params.id)

    res.render('editProduct', { product })
})

router.get('/login', async (req, res) => {   
    res.render('login')
})

router.get('/register', async (req, res) => { 
    if (req.user) {
        return res.redirect('/products')
    }

    res.render('register')
})

router.get('/premium', async (req, res) => {
    res.render('premium')
})

// -- view for "generete a password recovery request"
router.get('/passwordRecovery', async (req, res) => {
    if (req.user) {
        return res.redirect('/products')
    }

    res.render('passwordRecovery')
})

router.get('/emailSent', async (req, res) =>{
    res.render('emailSent')
})

router.get('/newPasswordSuccess', async (req, res) =>{
    res.render('pswRstScs')
})

// -- password recovery generated link
router.get('/pwdrecover/:id', async (req, res) => {
    const request = await PasswordRecoveryValidator.linkValidation(req.params.id);
    
    if(!request){
        return res.render('passwordReqExpired')
    }else{
        res.render('newPassword', {email: request.user})
    }
})

export default router;