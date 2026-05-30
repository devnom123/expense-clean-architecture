import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { ErrorApiResponse } from '../interfaces/api-response.interface';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(
    @InjectPinoLogger(GlobalExceptionFilter.name)
    private readonly logger: PinoLogger,
    private readonly configService: ConfigService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { statusCode, message, error } = this.resolveException(exception);
    const isProduction =
      this.configService.get<string>('nodeEnv') === 'production';

    this.logException(exception, statusCode, request.url, message);

    const body: ErrorApiResponse = {
      success: false,
      statusCode,
      message:
        isProduction && statusCode >= HttpStatus.INTERNAL_SERVER_ERROR
          ? 'Internal server error'
          : message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(statusCode).json(body);
  }

  private resolveException(exception: unknown): {
    statusCode: number;
    message: string | string[];
    error: string;
  } {
    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        return {
          statusCode,
          message: exceptionResponse,
          error: HttpStatus[statusCode] ?? 'Error',
        };
      }

      const responseObject = exceptionResponse as Record<string, unknown>;

      return {
        statusCode,
        message:
          (responseObject.message as string | string[]) ?? exception.message,
        error: (responseObject.error as string) ?? 'Error',
      };
    }

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      error: 'Internal Server Error',
    };
  }

  private logException(
    exception: unknown,
    statusCode: number,
    path: string,
    message: string | string[],
  ): void {
    const logMessage = Array.isArray(message) ? message.join(', ') : message;

    if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        { err: exception, path, statusCode },
        logMessage,
      );
      return;
    }

    this.logger.warn({ path, statusCode }, logMessage);
  }
}
