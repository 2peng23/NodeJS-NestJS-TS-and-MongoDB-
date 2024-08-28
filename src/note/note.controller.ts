import { Controller, Delete, Get, Post, Put, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { NoteService } from './note.service';

@Controller('api/notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}
  @Post()
  createNote(@Req() req: Request, @Res() res: Response) {
    const body = req.body;
    this.noteService.createNote(body, (error: any, response: any) => {
      if (error) {
        return res.status(error.status).json({
          success: 0,
          message: error.message,
          data: null,
        });
      }
      return res.status(201).json({
        success: 1,
        message: "Note created!",
        data: response,
      });
    });
  }

  @Get()
  getNotes(
    @Req() req: Request,
    @Res() res: Response,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('userId') userId?: any,
    @Query('tagId') tagId?: any,
    @Query('categoryId') categoryId?: any,
  ) {
    this.noteService.getNotes((error, response) => {
      if (error) {
        return res.status(error.status).json({
          success: 0,
          message: error.message,
          data: null,
        });
      }
      return res.status(200).json({
        success: 1,
        message: 'All Notes',
        data: response.data,
        total: response.total,
        page: response.page,
        limit: response.limit,
      });
    }, page, limit, userId, tagId, categoryId);
  }
  
  @Get(':id')
  getNote(@Req() req: Request, @Res() res: Response) {
    const id = req.params.id
    this.noteService.getNote(id, (error, response) => {
        if (error) {
            return res.status(error.status).json({
              success: 0,
              message: error.message,
              data: null,
            });
          }
          return res.status(200).json({
            success: 1,
            message: "Note info",
            data: response,
          });
    })
  }
  @Put(':id')
  updateNote(@Req() req: Request, @Res() res: Response) {
    const id = req.params.id
    const body = req.body
    this.noteService.updateNote(id,body, (error, response) => {
        if (error) {
            return res.status(error.status).json({
              success: 0,
              message: error.message,
              data: null,
            });
          }
          return res.status(200).json({
            success: 1,
            message: "Note updated",
            data: response,
          });
    })
  }
  @Delete(':id')
  deleteNote(@Req() req: Request, @Res() res: Response) {
    const id = req.params.id
    this.noteService.deleteNote(id, (error, response) => {
        if (error) {
            return res.status(error.status).json({
              success: 0,
              message: error.message,
              data: null,
            });
          }
          return res.status(200).json({
            success: 1,
            message: "Note deleted",
            data: response,
          });
    })
  }
}
