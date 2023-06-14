import { userModel } from "./models/user.model.js";

class UserDao{
    create(data){
        return userModel.create(data);
    }

    findByEmail(email){
        return userModel.findOne({email});
    }

    find(filter){
        return userModel.find(filter)
    }

    getById(id){
        return userModel.findById({_id: id});
    }

    updateConnection(id, time){
        return userModel.findByIdAndUpdate({_id: id}, {$set: {last_connection: time}}, {new: true});
    }

    async addDocuments(id, document){
        return await userModel.findByIdAndUpdate({_id: id}, {$push: {documents: document}}, {new: true})
    }

    addCart(id, cart){
        return userModel.findByIdAndUpdate({_id: id}, {$push: {carts: cart}}, {new: true})
    }

    editUser(id, data){
        return userModel.findByIdAndUpdate(id, data, {new: true})
    }

    findAndUpdate(email, role){
        return userModel.findOneAndUpdate({email: email}, {$set: {role: role}}, {new: true})
    }

    getAll(){
        return userModel.find();
    }

    deleteUser(id){
        return userModel.deleteOne({_id: id})
    }

    deleteUsers(last_connection){
        return userModel.deleteMany({last_connection: {$lt : last_connection}})
    }
    
}

export default new UserDao();