import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AuthModule } from './auth'
import { GlobalModule } from './global.module'
import { UsersModule } from './users'

@Module({
    imports: [GlobalModule, UsersModule, AuthModule],
    controllers: [AppController]
})
export class AppModule {}
