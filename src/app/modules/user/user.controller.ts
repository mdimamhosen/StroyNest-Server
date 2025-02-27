import catchAsyncResponse from '../../utils/catchAsyncResponse';

import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { UserServices } from './user.service';

const createUser = catchAsyncResponse(async (req, res) => {
  const result = await UserServices.createUser(req.body);
  const data = {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'User created successfully',
    data: result,
  };
  sendResponse(res, data);
});

const getAllUsers = catchAsyncResponse(async (req, res) => {
  const result = await UserServices.getAllUsers();
  const data = {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Users fetched successfully',
    data: result,
  };
  sendResponse(res, data);
});

const updateUser = catchAsyncResponse(async (req, res) => {
  console.log('req.body', req.body);
  console.log('req.params.id', req.params.id);
  const result = await UserServices.updateUser(req.params.id, req.body);
  const data = {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User updated successfully',
    data: result,
  };
  sendResponse(res, data);
});

const getAllAuthors = catchAsyncResponse(async (req, res) => {
  const result = await UserServices.getAllAuthors();
  const data = {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Authors fetched successfully',
    data: result,
  };
  sendResponse(res, data);
});

const getProfileData = catchAsyncResponse(async (req, res) => {
  console.log('req.params.id', req.params.id);
  const result = await UserServices.getProfileData(req.params.id);
  const data = {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Profile data fetched successfully',
    data: result,
  };
  sendResponse(res, data);
});

export const UserController = {
  createUser,
  getAllUsers,
  updateUser,
  getAllAuthors,
  getProfileData,
};
