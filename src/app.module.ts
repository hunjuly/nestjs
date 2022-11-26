import { Module } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthsModule } from './auths'
import { SystemExceptionsFilter } from './common/application'
import { GlobalModule } from './global.module'
import { UsersModule } from './users'

@Module({
    imports: [GlobalModule, UsersModule, AuthsModule],
    providers: [
        AppService,
        {
            provide: APP_FILTER,
            useClass: SystemExceptionsFilter
        }
    ],
    controllers: [AppController]
})
export class AppModule {}
