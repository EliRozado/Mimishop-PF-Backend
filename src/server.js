import express from "express";

import handlebars from 'express-handlebars';
import Handlebars from 'handlebars';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';

import config from "./config/envVariables.js";
import path from 'path';
import { __dirname } from './utils-dirName.js';

import initializePassport from "./config/passport.config.js";
import cookieParser from "cookie-parser";
import passport from "passport";

import indexRoutes from './routes/index.routes.js';
import bodyParser from "body-parser";

// - application
const app = express();

// -- middlewares
app.use('/static/', express.static(path.resolve(__dirname + '/public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
initializePassport();
app.use(passport.initialize());

/*app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).json({message: 'brb'})
})*/
app.use('/', indexRoutes)

// --- handlebars config
app.engine('hbs', handlebars.engine({
    extname: 'hbs',
    defaultLayout: 'main',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}))
app.set('view engine', 'hbs');
app.set('views', `${__dirname}/views`);

// - server start
app.listen(config.PORT, () => console.log(`Server up in port ${config.PORT}`))