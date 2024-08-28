import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Note, NoteDocument } from './note.schema';
import { Model } from 'mongoose';

@Injectable()
export class NoteService {
  constructor(
    @InjectModel(Note.name) private readonly noteModel: Model<NoteDocument>,
  ) {}

  async createNote(body: any, callBack: (error: any, response?: any) => void) {
    try {
      if (!body.title) {
        return callBack({
          status: 400,
          message: 'Title is required',
        });
      }
      if (!body.content) {
        return callBack({
          status: 400,
          message: 'Content is required',
        });
      }
      if (!body.note_userid) {
        return callBack({
          status: 400,
          message: 'Note userID is missing',
        });
      }
      const note = await this.noteModel.create(body);
      return callBack(null, note);
    } catch (error) {
      return callBack({
        status: 400,
        message: error.message,
      });
    }
  }

  async getNotes(
    callBack: (error: any, res?: any) => void,
    page: number,
    limit: number,
    userId: any,
    tagId: any,
    categoryId: any,
  ) {
    try {
      const skip = (page - 1) * limit;

      // Build the query object
    const query: any = {};
    if (userId) query.note_userid = userId;
    if (tagId) query.tag_id = tagId;
    if (categoryId) query.category_id = categoryId;

    // Fetch notes with pagination and filtering
    const [notes, total] = await Promise.all([
      this.noteModel.find(query).skip(skip).limit(limit).exec(),
      this.noteModel.countDocuments(query).exec(),
    ]);

      return callBack(null, {
        data: notes,
        total,
        page,
        limit,
      });
    } catch (error) {
      return callBack({
        status: 400,
        message: error.message,
      });
    }
  }

  async getNote(id: any, callBack: (error: any, res?: any) => void) {
    try {
      const note = await this.noteModel.findOne({ _id: id });
      if (!note) {
        return callBack({
          status: 404,
          message: 'Not not found',
        });
      }
      return callBack(null, note);
    } catch (error) {
      return callBack({
        status: 404,
        message: 'Not not found',
      });
    }
  }

  async updateNote(
    id: any,
    body: any,
    callBack: (error: any, res?: any) => void,
  ) {
    try {
      const note = await this.noteModel.findOneAndUpdate(
        { _id: id },
        { $set: body },
        {
          new: true,
        },
      );
      if (!note) {
        return callBack({
          status: 404,
          message: 'Not not found',
        });
      }
      return callBack(null, note);
    } catch (error) {
      return callBack({
        status: 404,
        message: 'Not not found',
      });
    }
  }

  async deleteNote(id: any, callBack: (error: any, res?: any) => void) {
    try {
      const note = await this.noteModel.findOneAndDelete({ _id: id });
      if (!note) {
        return callBack({
          status: 404,
          message: 'Not not found',
        });
      }
      return callBack(null, note);
    } catch (error) {
      return callBack({
        status: 404,
        message: 'Not not found',
      });
    }
  }
}
