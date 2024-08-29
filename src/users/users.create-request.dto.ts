import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, IsIn } from 'class-validator';

export class CreateUserRequestDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @MinLength(8)
  readonly password: string;

  @IsOptional() // Marks the field as optional
  @IsString()
  @IsIn(['0', '1']) // Ensures that if provided, the value is either '0' or '1'
  readonly user_role?: string; // `?` indicates that this field is optional
}
