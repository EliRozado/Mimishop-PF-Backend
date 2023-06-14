export default class PasswordRecoveryRepository{
    constructor(dao){
        this.dao = dao;
    }

    findPasswordRequest(id){
        return this.dao.getByID(id);
    }

    createLink(user_email){
        return this.dao.create(user_email);
    }
}