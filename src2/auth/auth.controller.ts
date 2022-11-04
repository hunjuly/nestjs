import { Controller, Delete, Logger, Post, Request, UseGuards } from '@nestjs/common'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { UserGuard } from './guards/user.guard'

@Controller('auth')
export class AuthController {
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

        return {}
    }
}
