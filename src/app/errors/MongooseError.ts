import mongoose from 'mongoose';
import { TErrorSource } from '../interface/error.interface';
import { TGenericErrorResponse } from '../interface/TGenericErrorResponse.interface';

export const MongooseErrorHandler = (
  error: mongoose.Error.ValidationError,
): TGenericErrorResponse => {
  const statusCode = 400;

  const errorSources: TErrorSource = Object.values(error.errors).map(
    (value: mongoose.Error.ValidatorError | mongoose.Error.CastError) => ({
      path: value.path,
      message: value.message,
    }),
  );

  return {
    statusCode,
    message: 'Validation error',
    errorSources,
  };
};
