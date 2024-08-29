import {
  Controller,
  Get,
  Req,
  Res,
  UseGuards,
  Next,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthGuard } from '@nestjs/passport';

import * as jwt from 'jsonwebtoken';
import * as passport from 'passport';
import * as dotenv from 'dotenv';

dotenv.config();

@Controller('api/auth')
export class AuthController {
  // Google Authentication route
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {
    // This route will redirect the user to Google for authentication
  }
  // Google Callback route
  @Get('google/callback')
  googleCallBack(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    passport.authenticate('google', { session: false }, (err, user, info) => {
      if (err) {
        return next(err); // Pass error to the next middleware
      }
      if (!user) {
        if (!res.headersSent) {
          return res.redirect('http://localhost:5555/api/users/login'); // Handle authentication failure
        }
        return;
      }

      // Generate JWT token
      const token = jwt.sign(
        { name: user.displayName, email: user.email, id: user.id }, // Payload
        process.env.JWT_SECRET_ACCESS, // Secret key
        { expiresIn: '1d' }, // 1 day
      );

      // Set the cookie with a 1-day expiration time
      if (!res.headersSent) {
        res.cookie('token', token, {
          httpOnly: true, // Prevents JavaScript access
          secure: process.env.NODE_ENV === 'production', // Only secure in production
          maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day in milliseconds
          path: '/', // Available site-wide
          sameSite: 'lax', // Adjust if needed
        });

        // Redirect to your frontend or any other route
        return res.status(200).json({
          success: 1,
          status: 200,
          message: 'Login via Google successful!',
          googleAccountInfo: user,
          jwtToken: token,
        });
      }
    })(req, res, next);
  }
}
