import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let error: string | object = '系统异常';
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      error = exception.getResponse();
    }
    console.error('Error: ', exception);
    response.status(status).json({
      statusCode: status,
      error,
    });
  }
}
