import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger'
import { ApiPaginatedResponse, PageQuery, Pagination } from 'src/components'
import { Public } from 'src/services/auth'
import { CreateUserDto, UpdateUserDto } from './domain'
import { ResponseUserDto } from './dto'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
    constructor(private readonly service: UsersService) {}

    /**
     * 사용자 생성
     */
    @Post()
    @Public()
    @ApiCreatedResponse({ type: ResponseUserDto })
    async create(@Body() dto: CreateUserDto) {
        const user = await this.service.create(dto)

        return new ResponseUserDto(user)
    }

    @Get()
    @ApiPaginatedResponse(ResponseUserDto)
    async findAll(@PageQuery() page: Pagination) {
        const found = await this.service.findAll(page)

        const items = found.items.map((item) => new ResponseUserDto(item))

        return { ...found, items }
    }

    @Get(':id')
    @ApiOkResponse({ type: ResponseUserDto })
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
        const user = await this.service.get(id)

        return new ResponseUserDto(user)
    }

    @Patch(':id')
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateUserDto) {
        return this.service.update(id, dto)
    }

    @Delete(':id')
    async remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.service.remove(id)
    }
}
