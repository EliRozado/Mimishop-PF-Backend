import passport from 'passport';
import config from '../config/envVariables.js';
import bcrypt from "bcrypt";

// --- password hash
export const hashPassword = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPass = (user, password) => bcrypt.compareSync(password, user.password);

// --- passportCall
export const passportCall = (strategy) => {
    return async(req, res, next) => {
        passport.authenticate(strategy, (err, user, info) => {
            if(err) return next(err);
            if(!user) {
                // forbidden view add here
                return res.redirect('/login')
            }
            req.user = user;
            next();
        })(req, res, next);
    }
}

// --- login with admin
export const admin = {
    user: config.ADMIN_EMAIL,
    password: config.ADMIN_PASSWORD,
    first_name: 'ad',
    last_name: 'min',
    role: "admin"
}