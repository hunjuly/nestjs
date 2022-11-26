import { Body, Controller, Delete, Get, Param, Patch, Post, UseFilters, UseGuards } from '@nestjs/common'
import {
    DomainExceptionFilter,
    OrderOption,
    OrderQuery,
    PageOption,
    PageQuery
} from 'src//common/application'
import { AdminGuard, SelfGuard } from 'src/auths'
import { CreateUserDto, UpdateUserDto } from './dto'
import { UsersService } from './users.service'

@UseFilters(DomainExceptionFilter)
@Controller('users')
export class UsersController {
    constructor(private readonly service: UsersService) {}

    @Post()
    create(@Body() createDto: CreateUserDto) {
        return this.service.create(createDto)
    }

    @Get()
    @UseGuards(AdminGuard)
    findAll(@PageQuery() page: PageOption, @OrderQuery() order?: OrderOption) {
        return this.service.findAll(page, order)
    }

    @Get(':id')
    @UseGuards(SelfGuard)
    findById(@Param('id') id: string) {
        return this.service.findById(id)
    }

    @Patch(':id')
    @UseGuards(SelfGuard)
    update(@Param('id') id: string, @Body() updateDto: UpdateUserDto) {
        return this.service.update(id, updateDto)
    }

    @Delete(':id')
    @UseGuards(SelfGuard)
    remove(@Param('id') id: string) {
        return this.service.remove(id)
    }
}
