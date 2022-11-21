import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AuthsModule } from './auths'
import { GlobalModule } from './global.module'
import { UsersModule } from './users'

@Module({
    imports: [GlobalModule, UsersModule, AuthsModule],
    controllers: [AppController]
})
export class AppModule {}
