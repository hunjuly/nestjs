import { Body, Controller, Delete, Get, Param, Patch, Post, UseFilters, UseGuards } from '@nestjs/common'
import { AdminGuard, UserGuard } from 'src/auth'
import { DomainExceptionFilter, PageQuery } from 'src/common'
import { Pagination } from 'src/common'
import { CrudsService } from './cruds.service'
import { CreateCrudDto, UpdateCrudDto } from './dto'

@UseFilters(DomainExceptionFilter)
@Controller('cruds')
export class CrudsController {
    constructor(private readonly service: CrudsService) {}

    @Post()
    create(@Body() createDto: CreateCrudDto) {
        return this.service.create(createDto, this.crudUrl)
    }

    // async findAll(@PageQuery() page: Pagination) {
    //     const found = await this.service.findAll(page)

    //     const items = found.items.map((item) => new ResponseUserDto(item))

    //     return { ...found, items }
    // }
    어디서 만들까 고민 중이다.
    '_links': {
        self: {
            href: 'http://localhost:8080/greeting?name=World'
        }
    }
    crudUrl(id: string) {
        return `/cruds/${id}`
    }

    @Get()
    findAll(@PageQuery() page: Pagination) {
        return this.service.findAll(page, this.crudUrl)
    }

    @UseGuards(UserGuard)
    @Get(':id')
    findById(@Param('id') id: string) {
        return this.service.findById(id, this.crudUrl)
    }

    @UseGuards(UserGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateDto: UpdateCrudDto) {
        return this.service.update(id, updateDto, this.crudUrl)
    }

    @UseGuards(AdminGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.service.remove(id)
    }
}
