import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import { User, UserModel } from 'src/users/users.schema';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserModel>,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      callbackURL: 'http://localhost:5555/api/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      const { email, name } = profile._json;
      
      // Check if the user already exists
      let user = await this.userModel.findOne({ email });

      // If the user doesn't exist, create a new one
      if (!user) {
        const userData = {
          name,
          email,
          password: name, // Consider hashing the password or using a secure method
        };
        const exist = await this.userModel.findOne({ email: userData.email });
        if (exist) {
          return done(null, false, { message: 'Email already taken!' });
        }
        const hashedPassword = await this.authService.hashPassword(userData.password);
        user = new this.userModel({
          ...userData,
          password: hashedPassword,
        });
        await user.save();
      }
      
      return done(null, profile);
    } catch (error) {
      return done(error, false, {
        message: 'An error occurred during authentication',
      });
    }
  }
}
