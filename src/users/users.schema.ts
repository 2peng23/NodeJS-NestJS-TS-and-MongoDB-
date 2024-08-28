import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true }) // Enables createdAt and updatedAt automatically
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, default: 0 })
  user_role: number; // Default value of 0

  @Prop({ default: null })
  access_token: string | null; // Nullable by defaulting to null

  @Prop({ default: null })
  refresh_token: string | null; // Nullable by defaulting to null
}

export const UserSchema = SchemaFactory.createForClass(User);
