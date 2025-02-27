import config from '../../config';
import catchAsyncResponse from '../../utils/catchAsyncResponse';
import sendResponse from '../../utils/sendResponse';
import { AuthService } from './auth.service';

const loginUser = catchAsyncResponse(async (req, res) => {
  const result = await AuthService.loginUser(req.body);

  console.log('result', result);
  const { refreshToken } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: config.nodeEnv === 'production',
    httpOnly: true,
    sameSite: true,
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  sendResponse(res, {
    data: {
      accessToken: result.accessToken,
    },
    message: 'Login Successfully',
    statusCode: 200,
    success: true,
  });
});

const changePassword = catchAsyncResponse(async (req, res) => {
  const { ...passwordData } = req.body;

  console.log('passwordData', passwordData);
  console.log('req.user', req.user);

  const result = await AuthService.changePassword(req.user, passwordData);

  sendResponse(res, {
    data: result,
    message: 'Password changed successfully',
    statusCode: 200,
    success: true,
  });
});

const refreshToken = catchAsyncResponse(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuthService.refreshToken(refreshToken);

  sendResponse(res, {
    data: result,
    message: 'Token refreshed successfully',
    statusCode: 200,
    success: true,
  });
});

export const AuthController = {
  loginUser,
  changePassword,
  refreshToken,
};
