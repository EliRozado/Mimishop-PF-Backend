import { PasswordRecoveryService, UserService } from "../repository/index.repository.js";
import { passwordRecoveryEmail } from "../config/mailing.config.js";
import AppException from "../utils/customErrors/AppException.js";
import { isValidPass, hashPassword } from "../utils/sessionUtils.js";

class PasswordRecoveryValidator{
    async generateLink(req){
        const email = req.body.email;

        // - no email was added
        if(!email) {
            throw new AppException('REQUIRED FIELD', 'Email is required', 400)
        };

        // - check if the email belongs to an existing user
        const user = await UserService.findByEmail(email);
        if(!user){
            throw new AppException('NOT FOUND', 'User does not exist', 404)
        }

        // - Create a new link for password recovery
        const request = await PasswordRecoveryService.createLink({user: email});

        // - Send the email with the created link
        const sendEmail = passwordRecoveryEmail(email, request.id)

        return {message: 'Email sent!'}
    }

    async linkValidation(id){
        const request = await PasswordRecoveryService.findPasswordRequest(id);

        return request;
    }

    async validatePassword(data){
        // - get user and new passwrod
        console.log(data)
        const { email, password } = data;

        // - check for user existance and bring their information
        const user = await UserService.findByEmail(email);

        // - Is the new password the same as the original?
        if(isValidPass(user, password)) {
            throw new AppException('PASSWORD','Password is already in use by the user', 400)
        };

        
        const update = await UserService.newPassword(user.id, {password: hashPassword(password)})

        return {message: 'Password change successful!'}
    }
}

export default new PasswordRecoveryValidator();