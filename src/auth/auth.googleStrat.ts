import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { User, UserDocument } from 'src/users/users.schema';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly authService: AuthService, // Correct injection here
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
      // Check if the user already exists
      let user = await this.userModel.findOne({ email: profile.email });

      // If the user doesn't exist, create a new one
      if (!user) {
        const userData = {
          name: profile.displayName,
          email: profile.emails[0].value,
          password: await this.authService.hashPassword(profile.id), // Hash Google ID as a password
        };

        user = new this.userModel(userData);
        await user.save();
      }

      // Pass the user to the done callback
      return done(null, profile);
    } catch (err) {
      // Handle errors appropriately
      return done(err, false, {
        message: 'An error occurred during authentication',
      });
    }
  }
}
