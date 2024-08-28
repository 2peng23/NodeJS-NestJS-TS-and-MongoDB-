import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NoteDocument = Note & Document;

@Schema({ timestamps: true }) // Enables createdAt and updatedAt automatically
export class Note {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  note_userid: string;

  @Prop({ default: null })
  tag_id: string | null; // Default value of 0

  @Prop({ default: null })
  category_id: string | null; // Nullable by defaulting to null
}

export const NoteSchema = SchemaFactory.createForClass(Note);
