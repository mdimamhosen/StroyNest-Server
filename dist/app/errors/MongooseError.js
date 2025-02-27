"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongooseErrorHandler = void 0;
const MongooseErrorHandler = (error) => {
    const statusCode = 400;
    const errorSources = Object.values(error.errors).map((value) => ({
        path: value.path,
        message: value.message,
    }));
    return {
        statusCode,
        message: 'Validation error',
        errorSources,
    };
};
exports.MongooseErrorHandler = MongooseErrorHandler;
