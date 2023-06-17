import { CartService, UserService } from "../repository/index.repository.js";
import AppException from '../utils/customErrors/AppException.js'
import { isValidPass, hashPassword } from "../utils/sessionUtils.js";

import { deletedAccount } from "../config/mailing.config.js";
import { userInformation, userRegister } from "../repository/dto/users.dto.js";
import { userDocsVerifyHelper } from "../utils/userDocsVerifier.js";

class UserValidator{
    async getAllUsers(){
        return UserService.getAllUsers();
    }

    async getUserById(id){      
        
        if(!id){
            throw new AppException("REQUIRED", "User ID is required", 400);
        } 

        const user = await UserService.findById(id)

        return userInformation(user);
    };

    async changeUserRole(id, role){
        const roles = ['user', 'premium']
        const user = await UserService.findById(id);
        
        if(!roles.includes(role)){
            throw new AppException("INVALID VALUE", "That is not a valid role.", 400);
        }

        const edit = await UserService.adminChangeRole(user.email, role)

        return edit;
    }

    async deleteUser(id){
        const user = await UserService.findById(id);

        const email = deletedAccount(user);

        return await UserService.deleteUser(id)
    }

    async registerUser(data){
        const {first_name, last_name, email, age, password} = data;

        if( !first_name || !last_name || !age || !email || !password ) {
            throw new AppException("REQUIRED FIELDS", "Missing required fields", 400);
        };

        // -- checks if there is an existing user with that email
        const user = await UserService.findByEmail(email);
        if(user) {
            throw new AppException("EMAIL IN USE", 'The email is already in use', 400);
        };

        const time =  new Date();

        const newUserInfo = {
            first_name, 
            last_name, 
            age, 
            email, 
            password: hashPassword(password),
            last_connection: time,
        };

        const newUser = await UserService.createUser(newUserInfo)
        return userRegister(newUser);
    }

    async userLogin(email, password){
        let cart;
        if(!email || !password){
            throw new AppException("REQUIRED FIELDS", "Email and password are required", 400);
        } 

        const user = await UserService.findByEmail(email);

        if(!user){
            throw new AppException("NOT FOUND", "User does not exist", 400);
        } 

        if(!isValidPass(user, password)){
            throw new AppException("INVALID CREDENTIALS", "Either the email or the password are invalid. Please try again.", 400);
        } 

        if(user.carts.length == 0){
            const create = await CartService.createCart();
            cart = create.id;
            await UserService.addCartToUser(user.id, cart)
        }
        if(!cart){
            cart = user.carts[0].cart;
        }

        user.cart = cart

        const time = new Date()
        const last_connection = await UserService.updateUserConnection(user.id, time)

        return user;
    }

    async logout(user){
        const userInfo = await UserService.findByEmail(user.email);

        const time = new Date()
        const last_connection = await UserService.updateUserConnection(userInfo.id, time)

        return last_connection;
    }

    async roleChangeVerify(id){
        let edit;
        let user = await UserService.findById(id);

        if(!user){
            throw new AppException("NOT FOUND", "User requested does not exist.", 404);
        }
        const documents = userDocsVerifyHelper(user);

        if(documents){
            edit = UserService.changeRole(id, {role: 'premium'});
        }else{
            throw new AppException("MISSING DOCUMENTS", "Documents required to upgrade to premium may be missing, please contact a system administrator for help", 404);        }

        return edit;
    }

    async documentVerify(id, req){
        const user = UserService.findById(id);
        const website = req.protocol + '://' + req.get('host');
        
        let documents = [];

        if(!req.files.id || !req.files.address || !req.files.status){
            throw new AppException("DOCUMENT REQUIRED", "All documents are required to continue.", 400);
        }
        documents = [
            {name: req.files.id[0].fieldname, reference: `${website}/static/files/documents/${req.files.id[0].filename}`},
            {name: req.files.address[0].fieldname, reference: `${website}/static/files/documents/${req.files.address[0].filename}`},
            {name: req.files.status[0].fieldname, reference: `${website}/static/files/documents/${req.files.status[0].filename}`}
        ]
        const addFiles = await UserService.addDocuments(id, documents)

        return addFiles;
    }

    async deleteInactiveUsers(){
        const time = new Date();

        const last_connection = time - 480 * 60 * 6000;

        const users = await UserService.findByLastConnection(new Date(last_connection));

        users.forEach((user) => {
            const email = deletedAccount(user);
        })
        
        const deletion = await UserService.deleteInactiveUsers(new Date(last_connection))
        return deletion;
    }
}

export default new UserValidator();