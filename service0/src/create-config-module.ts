import { ConfigModule } from '@nestjs/config'
import * as Joi from 'joi'

const logLevelOption = Joi.string().valid('error', 'warn', 'info', 'verbose').required()

export async function createConfigModule() {
    return ConfigModule.forRoot({
        isGlobal: true,
        validationSchema: Joi.object({
            NODE_ENV: Joi.string().valid('development', 'production').required(),
            LOG_STORAGE_PATH: Joi.string().required(),
            LOG_STORAGE_DAYS: Joi.number().required(),
            LOG_FILE_LEVEL: logLevelOption,
            LOG_CONSOLE_LEVEL: logLevelOption,

            SESSION_TYPE: Joi.string().valid('memory', 'redis').required(),
            SESSION_MAXAGE_SEC: Joi.number().required(),

            TYPEORM_TYPE: Joi.string().valid('sqlite', 'mysql').required(),
            TYPEORM_ENABLE_SYNC: Joi.boolean().default(false),

            TYPEORM_LOG_STORAGE_PATH: Joi.string().required(),
            TYPEORM_LOG_STORAGE_DAYS: Joi.number().required(),
            TYPEORM_LOG_FILE_LEVEL: logLevelOption,
            TYPEORM_LOG_CONSOLE_LEVEL: logLevelOption,

            TYPEORM_DATABASE: Joi.string(),
            TYPEORM_HOST: Joi.string(),
            TYPEORM_PORT: Joi.number(),
            TYPEORM_USERNAME: Joi.string(),
            TYPEORM_PASSWORD: Joi.string(),

            REDIS_HOST: Joi.string(),
            REDIS_PORT: Joi.number()
        })
    })
}
