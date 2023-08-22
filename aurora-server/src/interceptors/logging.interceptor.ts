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
    const { method, url } = request;

    this.logger.log(`Http Start ${method} ${url}`);
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        this.logger.log(`Http End ${method} ${url} ${Date.now() - now}ms`);
      }),
    );
  }
}
