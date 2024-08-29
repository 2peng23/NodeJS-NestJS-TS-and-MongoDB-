import { IsNotEmpty, IsOptional, IsString, IsNumber, ValidateIf } from 'class-validator';

export class CreateNoteRequestDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  readonly content: string;

  @IsNotEmpty()
  @ValidateIf((o) => typeof o.note_userid === 'string')
  @IsString()
  @ValidateIf((o) => typeof o.note_userid === 'number')
  @IsNumber({}, { each: true })
  readonly note_userid: string | number;

  @IsOptional()
  @IsString()
  readonly tag_id?: string;

  @IsOptional()
  @IsString()
  readonly category_id?: string;
}
