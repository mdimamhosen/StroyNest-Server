import { ErrorRequestHandler, NextFunction } from 'express';
import { TErrorSource } from '../interface/error.interface';
import { ZodError } from 'zod';
import { ZodErrorHandler } from '../errors/ZodError';
import { MongooseErrorHandler } from '../errors/MongooseError';
import { handleCastError } from '../errors/CastError';
import { handleDuplicateError } from '../errors/DuplicateError';
import { AppError } from '../utils/AppError';

const globalErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  let statusCode = err?.statusCode || 500;
  let message = err?.message || 'Internal server error';

  let error: TErrorSource = [
    {
      path: err.path || 'Path not found',
      message: err.message || 'Message not found',
    },
  ];

  if (err instanceof ZodError) {
    const simplifiedError = ZodErrorHandler(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    error = simplifiedError.errorSources;
  } else if (err.name === 'ValidationError') {
    const simplifiedError = MongooseErrorHandler(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    error = simplifiedError.errorSources;
  } else if (err.name === 'CastError') {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    error = simplifiedError.errorSources;
  } else if (err?.code === 11000) {
    const simplifiedError = handleDuplicateError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    error = simplifiedError.errorSources;
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    error = [
      {
        path: '',
        message: err.message,
      },
    ];
  } else if (err instanceof Error) {
    statusCode = 400;
    const errorMessage = err?.message.replace(/^Error:\s*/, '');
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

export default globalErrorHandler;
