import { Controller, Get } from '@nestjs/common';
import { ResponseMessage } from './presentation/http/decorators/response-message.decorator';
import { InjectDataSource } from '@nestjs/typeorm';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { DataSource } from 'typeorm';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectPinoLogger(AppController.name)
    private readonly logger: PinoLogger,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @ResponseMessage('Service is healthy')
  async health() {
    this.logger.debug('Health check started');
    await this.dataSource.query('SELECT 1');
    this.logger.info('Health check passed');
    return { status: 'ok', database: 'connected' };
  }
}
