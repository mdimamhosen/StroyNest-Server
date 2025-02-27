"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, data) => {
    return res.status(data.statusCode).json({
        messsage: data.message,
        success: data.success,
        data: data.data,
        statusCode: data.statusCode,
    });
};
exports.default = sendResponse;
