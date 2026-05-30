import { plainToInstance } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  validateSync,
} from 'class-validator';
import { LOG_LEVELS } from '../infrastructure/logging/log-level.enum';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV?: Environment;

  @IsInt()
  @Min(1)
  @Max(65535)
  @IsOptional()
  PORT?: number;

  @IsString()
  @IsOptional()
  DB_HOST?: string;

  @IsInt()
  @Min(1)
  @Max(65535)
  @IsOptional()
  DB_PORT?: number;

  @IsString()
  @IsOptional()
  DB_USERNAME?: string;

  @IsString()
  @IsOptional()
  DB_PASSWORD?: string;

  @IsString()
  @IsOptional()
  DB_NAME?: string;

  @IsBoolean()
  @IsOptional()
  DB_SYNCHRONIZE?: boolean;

  @IsBoolean()
  @IsOptional()
  DB_LOGGING?: boolean;

  @IsString()
  @IsOptional()
  CORS_ORIGIN?: string;

  @IsInt()
  @Min(1000)
  @IsOptional()
  THROTTLE_TTL?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  THROTTLE_LIMIT?: number;

  @IsIn(LOG_LEVELS)
  @IsOptional()
  LOG_LEVEL?: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: true,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
