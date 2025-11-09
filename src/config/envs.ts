import { Logger } from '@nestjs/common';
import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  DATABASE_URL: string;
  AUTH_SERVICE_URL: string;
  PORT: string;
  JWT_SECRET: string;
}

const logger = new Logger('Kiosco - error');

const envVarsSchema = joi
  .object({
    DATABASE_URL: joi.string().required(),
    AUTH_SERVICE_URL: joi.string().required(),
    PORT: joi.string().required(),
    JWT_SECRET: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envVarsSchema.validate(process.env);

if (error) {
  logger.error(`❌ Error en las variables de entorno: ${error.message}`);
  throw new Error(`❌ Error en las variables de entorno: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  dbUrl: envVars.DATABASE_URL,
  authServiceUrl: envVars.AUTH_SERVICE_URL,
  jwtSecret: envVars.JWT_SECRET,
};
