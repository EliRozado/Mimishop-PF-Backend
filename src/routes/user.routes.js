import { Router } from 'express';
import UsersController from '../controllers/users.controller.js';
import { uploadDocument, docUploadFields} from '../middleware/multerUpload.js';
import { progress_middleware } from '../middleware/progress.js';
import { canAccess } from '../middleware/access.js'
import { passportCall } from '../utils/sessionUtils.js';


const router = Router();

router.get('/', passportCall('current'), canAccess(['admin']), UsersController.getAllUsers);

router.get('/:id', UsersController.getUser);

router.delete('/', passportCall('current'), canAccess(['admin']), UsersController.deleteInactiveUsers);

router.put('/:id', passportCall('current'), canAccess(['admin']), UsersController.editUserRole);

router.delete('/:id', UsersController.deleteUser);

// -- move to views?
router.get('/premium/:id', passportCall('current'), canAccess(['user', 'premium']), UsersController.roleChange);

// -- upload user documents
router.post('/:id/documents', progress_middleware, uploadDocument.fields(docUploadFields), UsersController.documentUpload)

export default router;