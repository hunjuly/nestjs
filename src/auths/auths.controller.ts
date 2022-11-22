import { Controller, Delete, Get, Logger, Post, Request, UseGuards } from '@nestjs/common'
import { AdminGuard } from './guards'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { UserGuard } from './guards/user.guard'

@Controller('auths')
export class AuthsController {
    @Post()
    @UseGuards(LocalAuthGuard)
    login(@Request() req) {
        return req.user
    }

    @Delete()
    @UseGuards(UserGuard)
    async logout(@Request() req) {
        await req.logout((err) => {
            if (err) {
                Logger.error(err)
            }
        })
    }

    @Get('admin-test')
    @UseGuards(AdminGuard)
    adminTest() {}
}
