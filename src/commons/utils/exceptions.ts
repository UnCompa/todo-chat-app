export class CreateError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }

  static internal(message = 'Internal Server Error') {
    return new CreateError(message, 500);
  }

  static badRequest(message = 'Bad Request') {
    return new CreateError(message, 400);
  }

  static notFound(message = 'Not Found') {
    return new CreateError(message, 404);
  }

  static unauthorized(message = 'Unauthorized') {
    return new CreateError(message, 401);
  }

  static forbidden(message = 'Forbidden') {
    return new CreateError(message, 403);
  }
}
