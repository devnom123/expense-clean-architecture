import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { LogLevel } from './log-level.enum';

@Module({
  imports: [
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProduction =
          configService.get<string>('nodeEnv') === 'production';
        const level =
          configService.get<LogLevel>('logging.level') ?? LogLevel.Info;

        return {
          pinoHttp: {
            level,
            autoLogging: true,
            redact: ['req.headers.authorization', 'req.headers.cookie'],
            ...(isProduction
              ? {}
              : {
                  transport: {
                    target: 'pino-pretty',
                    options: {
                      colorize: true,
                      singleLine: true,
                      translateTime: 'SYS:standard',
                    },
                  },
                }),
          },
        };
      },
    }),
  ],
  exports: [LoggerModule],
})
export class LoggingModule {}
