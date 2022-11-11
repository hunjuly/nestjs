import { Body, Controller, Delete, Get, Param, Patch, Post, UseFilters, UseGuards } from '@nestjs/common'
import { AdminGuard, UserGuard } from 'src/auth'
import { DomainExceptionFilter, PageQuery } from 'src/common'
import { Pagination } from 'src/common'
import { CrudsService } from './cruds.service'
import { CreateCrudDto, CrudDto, UpdateCrudDto } from './dto'

type PaginatedList<E> = { items: E[] }

type Links = {
    links: { self: string }
}

@UseFilters(DomainExceptionFilter)
@Controller('cruds')
export class CrudsController {
    constructor(private readonly service: CrudsService) {}

    @Post()
    create(@Body() createDto: CreateCrudDto) {
        return this.service.create(createDto)
    }

    // 어디서 만들까? -> controller. service에서 하면 정보가 많이 넘어간다.
    // 조건을 설정해야 할 때는 어쩌지? -> 못한다. 의미가 없다.
    // '_links': {
    //     self: {
    //         href: 'http://localhost:8080/greeting?name=World'
    //     }
    // }
    @Get()
    async findAll(@PageQuery() page: Pagination) {
        const pagedResult = (await this.service.findAll(page)) as PaginatedList<CrudDto> & Links

        pagedResult.links = { self: 'http://localhost:8080/greeting?name=World' }

        return pagedResult
    }

    @UseGuards(UserGuard)
    @Get(':id')
    findById(@Param('id') id: string) {
        return this.service.findById(id)
    }

    @UseGuards(UserGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateDto: UpdateCrudDto) {
        return this.service.update(id, updateDto)
    }

    @UseGuards(AdminGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.service.remove(id)
    }
}
