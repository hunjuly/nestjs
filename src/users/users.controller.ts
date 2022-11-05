import { Body, Controller, Delete, Get, Param, Patch, Post, UseFilters, UseGuards } from '@nestjs/common'
import { AdminGuard, Public, UserGuard } from 'src/auth'
import { CreateUserDto, UpdateUserDto } from './dto'
import { UserExceptionFilter } from './user.exception-filter'
import { UsersService } from './users.service'

@UseFilters(UserExceptionFilter)
@Controller('users')
export class UsersController {
    constructor(private readonly service: UsersService) {}

    @Post()
    @Public()
    create(@Body() createDto: CreateUserDto) {
        return this.service.create(createDto)
    }

    @Get()
    @UseGuards(AdminGuard)
    findAll() {
        return this.service.findAll()
    }

    @Get(':id')
    @UseGuards(UserGuard)
    findById(@Param('id') id: string) {
        return this.service.findById(id)
    }

    @Patch(':id')
    @UseGuards(UserGuard)
    update(@Param('id') id: string, @Body() updateDto: UpdateUserDto) {
        return this.service.update(id, updateDto)
    }

    @Delete(':id')
    @UseGuards(AdminGuard)
    remove(@Param('id') id: string) {
        return this.service.remove(id)
    }
}
