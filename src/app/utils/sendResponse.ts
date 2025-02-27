import { Response } from 'express';

const sendResponse = <T>(
  res: Response,
  data: {
    success: boolean;
    statusCode: number;
    message: string;
    data?: T;
  },
) => {
  return res.status(data.statusCode).json({
    messsage: data.message,
    success: data.success,
    data: data.data,
    statusCode: data.statusCode,
  });
};

export default sendResponse;
