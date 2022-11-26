import { Controller, Delete, Get, Logger, Post, Request, UseGuards } from '@nestjs/common'
import { AdminGuard, LocalAuthGuard, Self, SelfGuard } from './guards'

@Controller('auths')
export class AuthsController {
    @Post()
    @UseGuards(LocalAuthGuard)
    login(@Request() req) {
        return req.user
    }

    @Delete()
    @UseGuards(SelfGuard)
    async logout(@Request() req) {
        await req.logout((err) => {
            if (err) {
                Logger.error(err)
            }
        })
    }

    @Get('test/admin-guard')
    @UseGuards(AdminGuard)
    adminTest() {}

    @Get('test/self-guard/:id')
    @Self({ userIDParam: 'id', allowAdmins: true })
    @UseGuards(SelfGuard)
    memberTest() {}
}
