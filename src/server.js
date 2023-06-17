import express from "express";
import cluster from 'cluster';
import { cpus } from "os";

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
import userValidator from './validators/user.validator.js';

import { Server } from "socket.io";

if(cluster.isPrimary){
    for(let i = 0; i<4; i++)
    cluster.fork()
}else{
    console.log(`I'm worker number ${process.pid}`)

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
    const server = app.listen(config.PORT, () => console.log(`Server up in port ${config.PORT}`))
    const io = new Server(server);

    // ----- socket
    io.on('connection', async (socket) => {
        console.log(socket.id)

        io.sockets.emit('users', await userValidator.getAllUsers())

        socket.on('change_role', async (data) => {
            await userValidator.changeUserRole(data.uid, data.role)
            
            io.sockets.emit('users', await userValidator.getAllUsers())
        })

        socket.on('user_delete', async (data) => {
            await userValidator.deleteUser(data.uid)

            io.sockets.emit('users', await userValidator.getAllUsers())
        })

        socket.on('purge_users', async () => {
            await userValidator.deleteInactiveUsers();

            io.sockets.emit('users', await userValidator.getAllUsers())
        })
    })
}