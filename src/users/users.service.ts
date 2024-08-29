import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './users.schema';
import { Model } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserRequestDto } from './users.create-request.dto';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, private readonly authService: AuthService) {}

    async getAllUsers(callBack: (error: any, response?: any) => void, name?: string) {
      try {
        const query = name ? { name: name } : {};
        const users = await this.userModel.find(query); // Call find on the model, not a document
        return callBack(null, users);
      } catch (error) {
        return callBack({
          status: 500,
          message: 'Server error.',
        });
      }
    }
    async createUser(user: CreateUserRequestDto, callBack: (error: any, response?: any) => void){
        try {
            const existingUser = await this.userModel.findOne({email: user.email})
            console.log(existingUser);
            if(existingUser) {
                return callBack({
                    status: 400,
                    message: 'Email already taken.',
                  });
            }
            const password = await this.authService.hashPassword(user.password)
            const newUser = await this.userModel.create({
                ...user,
                name: user.name,
                email: user.email,
                password: password,
                user_role : user.user_role
            })
            console.log(newUser);
            
            return callBack(null, newUser)
        } catch (error) {
            return callBack({
                status: 500,
                message: error.message,
              });
        }
    }
    async deleteUser(id: string, callBack: (error : any, response?: any) => void){
        try {
            const deleteUser = await this.userModel.findOneAndDelete({_id:id})
            if(!deleteUser){
                return callBack({
                    status: 404,
                    message: 'User not found.',
                  });
            }
            return callBack(null, deleteUser)
        } catch (error) {
            return callBack({
                status: 500,
                message: 'Server error.',
              });
        }
    }

//       // Sort users by id in descending order
//       const usersWithHighestId = [...this.users].sort((a, b) => b.id - a.id);

//       // Create new user with the next highest id
//       const newUser = {
//         id: usersWithHighestId.length > 0 ? usersWithHighestId[0].id + 1 : 1,
//         ...user,
//       };

//       // Push the new user to the users array
//       this.users.push(newUser);

//       return callBack(null, user);
//     } catch (error) {
//       return callBack({
//         message: 'Server error',
//         status: 500,
//       });
//     }
//   }

//   getUser(id: number) {
//     const user = this.users.find((user) => user.id === id);
//     return user;
//   }
//   updateUser(
//     id: number,
//     updateUser: { name?: string; email?: string; role?: string },
//   ) {
//     this.users = this.users.map((user) => {
//       if (user.id === id) {
//         return { ...user, ...updateUser }; // change user's values to updateUser's values
//       }
//       return user;
//     });
//     return this.getUser(id);
//   }

//   deleteUser(id: number) {
//     const removeUser = this.getUser(id);
//     this.users = this.users.filter((user) => user.id !== id);

//     return removeUser;
//   }

async loginUser (data : any, callBack : (error: any, response?: any) => void) {
    try {
      const user = await this.userModel.findOne({ email: data.email });
      if (!user) {
        return callBack({
            status: 400,
            message: 'Invalid Credentials',
          });
      }
      // const hashedPassword = await authHelper.hashPassword(data.password);
      const isMatch = await this.authService.comparePassword(
        data.password, //password from client-side
        user.password //password from db
      );
      if (!isMatch) {
        return callBack({
            status: 400,
            message: 'Invalid Credentials',
          });
      }
      return callBack(null, user);
    } catch (error) {
        return callBack({
            status: 400,
            message: error.message,
          });
    }
  };
}
