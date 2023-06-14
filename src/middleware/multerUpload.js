import multer from 'multer';
import AppException from '../utils/customErrors/AppException.js';
import { __dirname } from '../utils-dirName.js';

// -- upload destinations
const docFolder = `${__dirname}/public/files/documents`;
const productFolder = `${__dirname}/public/files/products`;
const profileFolder = '../public/files/profiles';

// -- file naming function
const nameGen = (req, file) => {
    let ext = file.originalname.split('.');

    if(req.body.title){
        return `${Date.now()}-${req.body.title}.${ext.slice(-1)}`
    }else if(req.body.user){ 
        return `${Date.now()}-${req.body.user}.${ext.slice(-1)}` // where to get the username from
    }else{
        return `${Date.now()}-${file.fieldname}.${ext.slice(-1)}` // where to get the username from
    }
    
}

// -- storage config function
const storage = (folder, name) => multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, folder)
    },
    filename: function(req, file, cb){
        cb(null, name(req, file))
    }
});

const config = (folder, name, type) => {
    try{
        return {
            storage: storage(folder, name),
            fileFilter: (req, file, cb) => {
                if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
                    cb(null, true);
                } else {
                    cb(null, false);
                    return cb(new AppException('INVALID FORMAT', 'Only .png, .jpg and .jpeg format allowed!', 400));
                }
            },
        }
    } catch(err){
        next(err)
    }
}

export const uploadDocument =  multer(config(docFolder, nameGen));
export const uploadProductImage =  multer(config(productFolder, nameGen));
export const profileImage =  multer(config(profileFolder, nameGen));

export const docUploadFields = [{name: 'id', maxCount: 1}, {name: 'address', maxCount: 1}, {name: 'status', maxCount: 1}]