"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCastError = void 0;
const handleCastError = (error) => {
    const statusCode = 400;
    const errorSources = [
        {
            path: error.path,
            message: error.message,
        },
    ];
    return {
        statusCode,
        message: 'Invalid data',
        errorSources,
    };
};
exports.handleCastError = handleCastError;
