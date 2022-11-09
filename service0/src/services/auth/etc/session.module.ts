import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as RedisStore from 'connect-redis'
import * as session from 'express-session'
import Redis from 'ioredis'
import * as passport from 'passport'
import { exit } from 'process'

function createOption(config: ConfigService) {
    type SessionType = 'memory' | 'redis' | undefined

    const type = config.get<SessionType>('SESSION_TYPE')
    // TODO 이거 숫자는 못 읽나? number로 해도 실제로는 string이 온다.
    const maxAge = config.get<string>('SESSION_MAXAGE_SEC')
    const cookie = { sameSite: true, httpOnly: false, maxAge: parseInt(maxAge) }

    const common = {
        saveUninitialized: false,
        secret: ['sup3rs3cr3t', 'akjsdfhkladjsfh', 'sfdgkg321'],
        resave: false,
        cookie,
        pauseStream: true
    }

    if (type === 'redis') {
        const host = config.get<string>('REDIS_HOST')
        const port = config.get<number>('REDIS_PORT')

        if (!host || !port) {
            Logger.error('Redis not available.')
            exit(1)
        }

        const client = new Redis({ host, port })

        const store = new (RedisStore(session))({ client, logErrors: true })

        Logger.verbose('using redis session.')

        return { ...common, store }
    } else if (type === 'memory') {
        const nodeEnv = config.get<string>('NODE_ENV')

        if (nodeEnv === 'production') {
            Logger.error('Do not use memory session on production.')

            exit(1)
        }

        Logger.verbose('using memory session.')

        return common
    }
}

@Module({})
export class SessionModule implements NestModule {
    constructor(private config: ConfigService) {}

    // 자원 정리가 필요하면 여기서 한다. redisClient?
    async onModuleInit() {}
    async onModuleDestroy() {}

    configure(consumer: MiddlewareConsumer) {
        const option = createOption(this.config)

        consumer.apply(session(option), passport.initialize(), passport.session()).forRoutes('*')
    }
}
