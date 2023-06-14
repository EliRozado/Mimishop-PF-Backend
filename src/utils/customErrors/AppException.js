export default class AppException extends Error{
    constructor(name, message, status){
        super(message);
        this.name = name;
        this.message = message;
        this.status = status;
    }

    toString(){
        return `${this.name} : ${this.message}`
    }
}