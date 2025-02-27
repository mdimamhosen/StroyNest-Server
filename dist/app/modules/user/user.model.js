"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const UserSchema = new mongoose_1.Schema({
    id: { type: String, unique: true, trim: true, required: true },
    name: { type: String, required: true },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
    },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
}, {
    timestamps: true,
});
// hashing the password before saving the user
UserSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        this.password = yield bcryptjs_1.default.hash(this.password, Number(10));
        next();
    });
});
// removing the password from the response
UserSchema.post('save', function (doc, next) {
    doc.password = '';
    next();
});
UserSchema.statics.isUserExist = function (email) {
    return __awaiter(this, void 0, void 0, function* () {
        const isUser = yield exports.User.findOne({ email }).select('password');
        if (!isUser)
            return false;
        return true;
    });
};
UserSchema.statics.isUserBlocked = function (email) {
    return __awaiter(this, void 0, void 0, function* () {
        const isUser = yield exports.User.findOne({ email, isBlocked: true }).select('password');
        if (!isUser)
            return false;
        return true;
    });
};
UserSchema.statics.isUserDeleted = function (email) {
    return __awaiter(this, void 0, void 0, function* () {
        const isUser = yield exports.User.findOne({ email, isDeleted: true });
        if (!isUser)
            return false;
        return true;
    });
};
UserSchema.statics.isPasswordMatched = function (password, email) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield exports.User.findOne({ email }).select('password');
        if (!user)
            return false;
        const isPass = yield bcryptjs_1.default.compare(password, user.password);
        return isPass;
    });
};
UserSchema.statics.isJwtIssuedBeforePasswordChange = function (passwordChangeTimeStamp, jwtIssuedTimeStamp) {
    console.log({
        passwordChangeTimeStamp: passwordChangeTimeStamp.getTime() / 1000,
        jwtIssuedTimeStamp: jwtIssuedTimeStamp,
    });
    if (passwordChangeTimeStamp.getTime() / 1000 > jwtIssuedTimeStamp) {
        return true;
    }
    return false;
};
exports.User = (0, mongoose_1.model)('User', UserSchema);
