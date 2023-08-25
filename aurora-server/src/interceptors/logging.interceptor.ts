import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger: Logger = new Logger(LoggingInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body } = request;

    this.logger.log(
      `Http Start METHOD: ${method}, URL: ${url}, BODY: ${JSON.stringify(
        body,
      )}`,
    );
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        this.logger.log(
          `Http End METHOD: ${method}, URL: ${url}, TIME: ${
            Date.now() - now
          }ms`,
        );
      }),
    );
  }
}
