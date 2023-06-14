import { pwdRecoveryModel } from "./models/pwdRecovery.model.js";

class PasswordRecoveryDao{
    getByID(id){
        return pwdRecoveryModel.findById(id);
    }

    create(data){
        return pwdRecoveryModel.create(data);
    }
}

export default new PasswordRecoveryDao();