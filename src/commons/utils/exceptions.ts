// types/errors.ts

export enum HttpStatusCode {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

interface CustomErrorOptions {
  message: string;
  statusCode: HttpStatusCode;
  name?: string;
  details?: any; // opcional: puedes incluir detalles como errores de validación
}

export class CreateError extends Error {
  public statusCode: HttpStatusCode;
  public details?: any;

  constructor({ message, statusCode, name = 'Error', details }: CustomErrorOptions) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }

  static internal(message = 'Internal Server Error', details?: any) {
    return new CreateError({
      message,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      name: 'InternalError',
      details,
    });
  }

  static badRequest(message = 'Bad Request', details?: any) {
    return new CreateError({
      message,
      statusCode: HttpStatusCode.BAD_REQUEST,
      name: 'BadRequestError',
      details,
    });
  }

  static notFound(message = 'Not Found', details?: any) {
    return new CreateError({
      message,
      statusCode: HttpStatusCode.NOT_FOUND,
      name: 'NotFoundError',
      details,
    });
  }

  static unauthorized(message = 'Unauthorized', details?: any) {
    return new CreateError({
      message,
      statusCode: HttpStatusCode.UNAUTHORIZED,
      name: 'UnauthorizedError',
      details,
    });
  }

  static forbidden(message = 'Forbidden', details?: any) {
    return new CreateError({
      message,
      statusCode: HttpStatusCode.FORBIDDEN,
      name: 'ForbiddenError',
      details,
    });
  }
}
