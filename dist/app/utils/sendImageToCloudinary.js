"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.uploadImageToCloudinary = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const cloudinary_1 = require("cloudinary");
const config_1 = __importDefault(require("../config"));
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
cloudinary_1.v2.config({
    cloud_name: config_1.default.cloudName,
    api_key: config_1.default.apiKey,
    api_secret: config_1.default.apiSecret,
});
// cloudinary.config({
//   cloud_name: 'drxkgsnhy',
//   api_key: '414838558865527',
//   api_secret: 'hcOnL_teRWjwt-C2RMF3UdqPi8U',
// });
const uploadImageToCloudinary = (path, public_id, folderName) => {
    return new Promise((resolve, reject) => {
        cloudinary_1.v2.uploader.upload(path, { folder: folderName, public_id }, function (error, result) {
            if (error) {
                return reject(error);
            }
            resolve(result);
            fs_1.default.unlink(path, err => {
                if (err) {
                    console.error('Error removing file:', err);
                }
                else {
                    console.log('File removed successfully:', path);
                }
            });
        });
    });
};
exports.uploadImageToCloudinary = uploadImageToCloudinary;
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = process.cwd() + '/uploads';
        if (!fs_1.default.existsSync(uploadPath)) {
            fs_1.default.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1]);
    },
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    }
    else {
        cb(new Error('Only images are allowed!'), false);
    }
};
exports.upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});
