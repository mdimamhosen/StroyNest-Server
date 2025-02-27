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
Object.defineProperty(exports, "__esModule", { value: true });
exports.genarateUserId = void 0;
const user_const_1 = require("./user.const");
const user_model_1 = require("./user.model");
const findLastUserId = () => __awaiter(void 0, void 0, void 0, function* () {
    const lastUser = yield user_model_1.User.findOne({
        role: user_const_1.USER_ROLE.user,
    }, { id: 1, _id: 0 })
        .sort({ createdAt: -1 })
        .lean();
    return (lastUser === null || lastUser === void 0 ? void 0 : lastUser.id) ? lastUser.id.substring(2) : undefined;
});
const genarateUserId = () => __awaiter(void 0, void 0, void 0, function* () {
    let currentUserId = (0).toString().padStart(4, '0');
    const lastUserId = yield findLastUserId();
    if (lastUserId) {
        currentUserId = (Number(lastUserId) + 1).toString().padStart(4, '0');
    }
    else {
        currentUserId = (1).toString().padStart(4, '0');
    }
    const userId = `U-${currentUserId}`;
    return userId;
});
exports.genarateUserId = genarateUserId;
