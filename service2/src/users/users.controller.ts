import { Body, Controller, Delete, Get, Param, Patch, Post, UseFilters, UseGuards } from '@nestjs/common'
import { Public, UserGuard } from 'src/auth'
import { DomainExceptionFilter } from './domain-exception.filter'
import { CreateUserDto, UpdateUserDto } from './dto'
import { UsersService } from './users.service'

@UseGuards(UserGuard)
@UseFilters(DomainExceptionFilter)
@Controller('users')
export class UsersController {
    constructor(private readonly service: UsersService) {}

    @Post()
    @Public()
    create(@Body() createDto: CreateUserDto) {
        return this.service.create(createDto)
    }

    @Get()
    findAll() {
        return this.service.findAll()
    }

    @Get(':id')
    findById(@Param('id') id: string) {
        return this.service.findById(id)
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateDto: UpdateUserDto) {
        return this.service.update(id, updateDto)
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.service.remove(id)
    }
}
