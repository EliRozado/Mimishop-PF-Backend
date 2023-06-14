export const MongoErrorHandler = (err) => {
    let mongoError = {...err};
    mongoError.message = err.message;
    let customError = {};

    switch(err.name){
        case 'CastError':
            return customError = {
                name: 'NOT FOUND',
                message: 'Resource not found',
                status: 404
            }
            break;
        case 'ValidationError':
            let errors = {};

            Object.keys(err.errors).forEach((key) => {
                
                errors[key] = err.errors[key].message;
            });

            return customError = {
                name: 'INVALID VALUES',
                message: errors,
                status: 400
            }
        default:
            return false;
    }
}