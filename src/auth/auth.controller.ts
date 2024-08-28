import { Controller, Get, Req, Res, UseGuards, Next } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthGuard } from '@nestjs/passport';

import * as jwt from 'jsonwebtoken'; // Import jwt
import * as passport from 'passport'; // Import jwt

import * as dotenv from 'dotenv';
dotenv.config(); // This will load the .env file

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
        return next(err); // Handle authentication errors
      }
      if (!user) {
        return res.redirect('http://localhost:5555/login'); // Handle authentication failure
      }

      // Generate JWT token
      const token = jwt.sign(
        { name: user.displayName, email: user.email, id: user.id }, // Payload
        process.env.JWT_SECRET_ACCESS, // Secret key
        { expiresIn: "1d" } // 1 day
      );

      // Set the cookie with a 1-day expiration time
      res.cookie('token', token, {
        httpOnly: true, // Prevents JavaScript access
        secure: process.env.NODE_ENV === 'production', // Only secure in production
        maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day in milliseconds
        path: '/', // Available site-wide
        sameSite: 'lax', // Adjust if needed
      });

      // Redirect to your frontend or any other route
      res.status(200).json({
        succes: 1,
        status: 200,
        message: "Login via google successful!",
        googleAccountInfo: user,
        jwtToken: token
      })
    })(req, res, next);
  }
}
