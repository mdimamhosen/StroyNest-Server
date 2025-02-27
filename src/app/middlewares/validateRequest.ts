import { AnyZodObject } from 'zod';
import { RequestHandler } from 'express';
import catchAsyncResponse from '../utils/catchAsyncResponse';

const ValidateUserRequest = (schema: AnyZodObject): RequestHandler => {
  return catchAsyncResponse(async (req, res, next) => {
    await schema.parseAsync({
      body: req.body,
      cookies: req.cookies,
    });
    next();
  });
};

export default ValidateUserRequest;
