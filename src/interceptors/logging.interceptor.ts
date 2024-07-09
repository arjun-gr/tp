import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { LoggerService } from '../providers/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
  ) {}
  
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (
      this.configService.get<string>('LOG_REQUESTS').toLowerCase() == 'true'
    ) {
      const ctx = context.switchToHttp();
      const request = ctx.getRequest<Request>();
      this.loggerService.getInfoLogger().info('Route:', {
        method: request.method,
        body: request.body,
        route: request.url,
        headers: request.headers,
      });
    }
    return next.handle();
  }
}
