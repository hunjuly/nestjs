import { Body, Controller, Delete, Get, Param, Patch, Post, UseFilters, UseGuards } from '@nestjs/common'
import { AdminGuard, UserGuard } from 'src/auth'
import { DomainExceptionFilter, PageQuery } from 'src/common'
import { Pagination } from 'src/common'
import { CrudsService } from './cruds.service'
import { CreateCrudDto, CrudDto, UpdateCrudDto } from './dto'

type PaginatedList<E> = Pagination & { total: number; items: E[] }

type CrudLinks = {
    links: { self: string }
}

type PageLinks = {
    links: {
        self: string
        next?: string
        prev?: string
        first: string
        last: string
    }
}

@UseFilters(DomainExceptionFilter)
@Controller('cruds')
export class CrudsController {
    constructor(private readonly service: CrudsService) {}

    @Post()
    create(@Body() createDto: CreateCrudDto) {
        return this.service.create(createDto)
    }

    @Get()
    async findAll(@PageQuery() page: Pagination) {
        const pagedResult = (await this.service.findAll(page)) as PaginatedList<CrudDto> & PageLinks

        pagedResult.items.forEach((item) => {
            const linked = item as CrudDto & CrudLinks
            linked.links = {
                self: '/cruds/' + linked.id
            }
        })

        // get/delete는 어찌어찌 할 수 있다 post는 어찌하나? url을 알아도 body는 모른다.
        pagedResult.links = {
            self: '/cruds?name=World',
            first: '/cruds?name=World',
            last: '/cruds?name=World',
            next: '/cruds?name=World',
            prev: '/cruds?name=World'
        }

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
