export class ResponseHelper {
  static error(res: any, error: any) {
    return res.status(error.status).json({
      success: 0,
      message: error.message,
      data: null,
    });
  }
}
