import mongoose from 'mongoose';
import { TGenericErrorResponse } from '../interface/TGenericErrorResponse.interface';
import { TErrorSource } from '../interface/error.interface';

export const handleCastError = (
  error: mongoose.Error.CastError,
): TGenericErrorResponse => {
  const statusCode = 400;

  const errorSources: TErrorSource = [
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
