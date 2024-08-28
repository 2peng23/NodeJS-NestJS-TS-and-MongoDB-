import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'express';
import * as jwt from 'jsonwebtoken'; // Import jwt

@Controller('api/users') // route is /users it is called 'decorators'
export class UsersController {
  //import the service here using constructor
  constructor(private readonly userService: UsersService) {}

  //   The flow of routes should be static to dynamic
  // static routes doesnt accept parameters
  // dynamic routes accept parameters

  //   STATIC routes --without params
  // GET /users or /users?name="" -- with query
  @Get()
  getAllUsers(@Res() res: Response, @Query('name') name?: '') {
    //role? state that this is optional
    this.userService.getAllUsers((error: any, response: any) => {
      if (error) {
        return res.status(error.status).json({
          success: 0,
          message: error.message,
          data: null,
        });
      }
      return res.status(200).json({
        success: 1,
        message: 'All users',
        data: response,
      });
    }, name);
  }

  // POST /users
  @Post()
  createUser(
    @Body()
    user: { name: string; email: string; password: string; user_role: string },
    @Res() res: Response,
  ) {
    this.userService.createUser(user, (error: any, response: any) => {
      if (error) {
        return res.status(error.status).json({
          success: 0,
          message: error.message,
          data: null,
        });
      }
      return res.status(201).json({
        success: 1,
        message: 'User created!',
        data: response,
      });
    });
  }

  //   DYNAMIC routes --with params

  // PUT /users/:id
  @Put(':id')
  updateUser(@Param('id') id: string, @Body() updateUser: {}) {
    return { id, ...updateUser };
  }

  // DELETE /users/:id
  @Delete(':id')
  deleteUser(@Param('id') id: string, @Res() res: Response) {
    this.userService.deleteUser(id, (error: any, response: any) => {
      if (error) {
        return res.status(error.status).json({
          success: 0,
          message: error.message,
          data: null,
        });
      }
      return res.status(201).json({
        success: 1,
        message: 'User deleted!',
        data: response,
      });
    });
  }

  @Get('login')
  async loginUser(@Req() req: Request, @Res() res: Response) {
    res.send(
      "<Button><a href='/api/auth/google'>Login via google</a></Button>",
    );
  }
  //   login
  @Post('login') // Define the route for the login method
  async login(@Req() req: Request, @Res() res: Response) {
    try {
      // Your login logic here
      const body = req.body;

      this.userService.loginUser(body, (err, response) => {
        if (err) {
          return res.status(500).json({
            success: 0,
            message: err,
            data: null,
          });
        }

        // sign the JWT token
        jwt.sign(
          {
            name: response.name,
            email: response.email,
            id: response._id,
            role: response.user_role,
          }, // Payload
          process.env.JWT_SECRET_ACCESS, // Secret key
          { expiresIn: '1d' }, // 1 day
          (err: any, token: any) => {
            if (err) {
              return res.status(500).json({
                success: 0,
                message: 'Token generation failed',
                data: null,
              });
            }

            // Set the cookie with a 1-day expiration time
            res.cookie('token', token, {
              httpOnly: true, // Prevents JavaScript access
              secure: true, // Not using HTTPS in local development
              maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day in milliseconds
              path: '/', // Available site-wide
              sameSite: 'lax',
            });

            return res.status(200).json({
              success: 1,
              message: 'Successfully Logged In!',
              data: response,
            });
          },
        );
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    try {
      res.cookie('token', '', { maxAge: 1 }).status(200).json({
        success: 1,
        message: 'Logout Succefully!',
      });
    } catch (error) {
      res.json({
        success: 0,
        message: error,
      });
    }
  }
}
