import UserValidator from "../validators/user.validator.js";
import { MongoErrorHandler } from "../utils/customErrors/mongoErrors.js";

class UsersController{
    async getAllUsers(req, res){
        try{
            const users = await UserValidator.getAllUsers();

            res.status(200).json(users);
        } catch(err){
            let error = MongoErrorHandler(err) || err;

            if(!err.status){
                return res.status(500).json({ error: 'UNHANDLED ERROR', message: err.message})
            }

            res.status(error.status).json({ error: error.name, message: error.message });
        }
    }                                                                                                                                                                                                                                                                                                                                                                                                                   

    async getUser(req, res){
        try{
            const user = await UserValidator.getUserById(req.params.id);
    
            res.status(200).json(user);
    
        }catch(err){
            let error = MongoErrorHandler(err) || err;

            if(!err.status){
                return res.status(500).json({ error: 'UNHANDLED ERROR', message: err.message})
            }

            res.status(error.status).json({ error: error.name, message: error.message });
        }
    }

    async editUserRole(req, res){
        // -- this one is an admin action
        try{
            const user = await UserValidator.changeUserRole(req.params.id, req.body.role);
    
            res.status(200).json(user);
    
        }catch(err){
            let error = MongoErrorHandler(err) || err;

            if(!err.status){
                return res.status(500).json({ error: 'UNHANDLED ERROR', message: err.message})
            }

            res.status(error.status).json({ error: error.name, message: error.message });
        }
    }

    async deleteUser(req, res){
        try{
            const user = await UserValidator.deleteUser(req.params.id);
    
            res.status(200).json(user);
    
        }catch(err){
            let error = MongoErrorHandler(err) || err;

            if(!err.status){
                return res.status(500).json({ error: 'UNHANDLED ERROR', message: err.message})
            }

            res.status(error.status).json({ error: error.name, message: error.message });
        }
    }

    async roleChange(req, res){
        try{
            const user = await UserValidator.roleChangeVerify(req.params.id);

            return res.status(201).send(`User ${req.params.id} role was changed to ${user.role}`)
        }catch(err){
            let error = MongoErrorHandler(err) || err;

            if(!err.status){
                return res.status(500).json({ error: 'UNHANDLED ERROR', message: err.message})
            }

            res.status(error.status).json({ error: error.name, message: error.message });
        }
    }

    async documentUpload(req, res){
        try{
            const user = await UserValidator.documentVerify(req.params.id, req.files);

            return res.status(201).send({status: "SUCCESSFUL", message: `Documents uploaded successfully`})
        }catch(err){
            let error = MongoErrorHandler(err) || err;

            if(err.name == 'Error'){
                return res.status(500).json({ error: 'UNHANDLED ERROR', message: err.message})
            }

            res.status(error.status).json({ error: error.name, message: error.message });
        }
    }

    async deleteInactiveUsers(req, res){
        try{
            const user = await UserValidator.deleteInactiveUsers();

            return res.status(201).send({status: "SUCCESSFUL", message: `Inactive users deleted successfully.`, payload: user})
        }catch(err){
            let error = MongoErrorHandler(err) || err;

            if(err.name == 'Error'){
                return res.status(500).json({ error: 'UNHANDLED ERROR', message: err.message})
            }

            res.status(error.status).json({ error: error.name, message: error.message });
        }
    }
}

export default new UsersController();

    /*
    async changeRole(req, res){
        try{
            const user = await UserValidator.changeRole(req);

            return res.status(201).send(`User ${req.params.uid} role was changed to ${user.role}`)
        }catch(err){
            res.status(400).json({error: err.message})
        }
    }

    async current(req, res){
        const user = new UserDTO(req.user)
        req.logger.debug('Obtained current user information')
        res.send(user);
    }*/