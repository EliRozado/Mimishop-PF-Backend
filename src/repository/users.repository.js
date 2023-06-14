import passport from "passport";
import { getUsersResDTO } from "./dto/users.dto.js";

export default class UserRepository{
    constructor(dao){
        this.dao = dao;
    }

    createUser({first_name, last_name, email, age, password, last_connection}){
        return this.dao.create({first_name: first_name, last_name: last_name, email: email, age: age, password: password, last_connection: last_connection});
    }

    async getAllUsers(){
        const data = await this.dao.getAll();
        const users = getUsersResDTO(data)

        return users;
    }

    async deleteUser(id){
        return this.dao.deleteUser(id)
    }

    findByEmail(email){
        return this.dao.findByEmail(email);
    }

    findById(id){
        return this.dao.getById(id);
    }

    findByLastConnection(time){
        return this.dao.find({last_connection: {$lt : time}})
    }

    updateUserConnection(id, data){
        return this.dao.updateConnection(id, data);
    }

    newPassword(id, password){
        return this.dao.editUser({_id: id}, password)
    }

    async addDocuments(id, documents){
        let response;

        documents.forEach( async (doc) => {
            response = await this.dao.addDocuments(id, {name: doc.name, reference: doc.reference})
        });

        return response;
    }

    addCartToUser(id, cart_id){
        return this.dao.addCart(id, {cart: cart_id})
    }

    changeRole(id, role){
        return this.dao.editUser({_id: id}, role)
    }

    adminChangeRole(email, role){
        return this.dao.findAndUpdate(email, role);
    }

    deleteInactiveUsers(time){
        return this.dao.deleteUsers(time)
    }
    
}