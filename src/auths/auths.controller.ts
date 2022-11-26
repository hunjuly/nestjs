import { Controller, Delete, Get, Logger, Post, Request, UseGuards } from '@nestjs/common'
import { AdminGuard, LocalAuthGuard, MemberGuard } from './guards'

@Controller('auths')
export class AuthsController {
    @Post()
    @UseGuards(LocalAuthGuard)
    login(@Request() req) {
        return req.user
    }

    @Delete()
    @UseGuards(MemberGuard)
    async logout(@Request() req) {
        await req.logout((err) => {
            if (err) {
                Logger.error(err)
            }
        })
    }

    @Get('admin-guard-test')
    @UseGuards(AdminGuard)
    adminTest() {}

    @Get('member-guard-test')
    @UseGuards(MemberGuard)
    memberTest() {}
}
