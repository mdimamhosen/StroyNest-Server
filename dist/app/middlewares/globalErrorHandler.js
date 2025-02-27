"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const ZodError_1 = require("../errors/ZodError");
const MongooseError_1 = require("../errors/MongooseError");
const CastError_1 = require("../errors/CastError");
const DuplicateError_1 = require("../errors/DuplicateError");
const AppError_1 = require("../utils/AppError");
const globalErrorHandler = (err, req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
next) => {
    let statusCode = (err === null || err === void 0 ? void 0 : err.statusCode) || 500;
    let message = (err === null || err === void 0 ? void 0 : err.message) || 'Internal server error';
    let error = [
        {
            path: err.path || 'Path not found',
            message: err.message || 'Message not found',
        },
    ];
    if (err instanceof zod_1.ZodError) {
        const simplifiedError = (0, ZodError_1.ZodErrorHandler)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        error = simplifiedError.errorSources;
    }
    else if (err.name === 'ValidationError') {
        const simplifiedError = (0, MongooseError_1.MongooseErrorHandler)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        error = simplifiedError.errorSources;
    }
    else if (err.name === 'CastError') {
        const simplifiedError = (0, CastError_1.handleCastError)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        error = simplifiedError.errorSources;
    }
    else if ((err === null || err === void 0 ? void 0 : err.code) === 11000) {
        const simplifiedError = (0, DuplicateError_1.handleDuplicateError)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        error = simplifiedError.errorSources;
    }
    else if (err instanceof AppError_1.AppError) {
        statusCode = err.statusCode;
        message = err.message;
        error = [
            {
                path: '',
                message: err.message,
            },
        ];
    }
    else if (err instanceof Error) {
        statusCode = 400;
        const errorMessage = err === null || err === void 0 ? void 0 : err.message.replace(/^Error:\s*/, '');
        message = errorMessage || 'Bad request';
        error = [
            {
                path: '',
                message: errorMessage || 'Bad request',
            },
        ];
    }
    res.status(statusCode).json({
        statusCode,
        message,
        error: {
            details: error,
        },
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
};
exports.default = globalErrorHandler;
