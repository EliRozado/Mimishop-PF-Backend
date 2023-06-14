import { Router } from 'express';
import { passportCall } from '../utils/sessionUtils.js';
import SessionController from '../controllers/session.controller.js'

const router = Router();

// -- login
router.post('/login', SessionController.login);

// -- register new user
router.post('/register', SessionController.register)

// -- restore password request
router.post('/sendMail', SessionController.passwordRecoveryRequest);

// -- set a new user password
router.post('/newUserPassword', SessionController.validateNewPassword);

// -- logout
router.get('/logout', passportCall('current'), SessionController.handleLogout);

export default router;