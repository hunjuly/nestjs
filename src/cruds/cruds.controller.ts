import { Body, Controller, Delete, Get, Param, Patch, Post, UseFilters, UseGuards } from '@nestjs/common'
import {
    DomainExceptionFilter,
    OrderOption,
    OrderQuery,
    PageOption,
    PageQuery
} from 'src//common/application'
import { AdminGuard, SelfGuard } from 'src/auths'
import { CrudsService } from './cruds.service'
import { CreateCrudDto, UpdateCrudDto } from './dto'

@UseFilters(DomainExceptionFilter)
@Controller('cruds')
export class CrudsController {
    constructor(private readonly service: CrudsService) {}

    @Post()
    create(@Body() createDto: CreateCrudDto) {
        return this.service.create(createDto)
    }

    @Get()
    findAll(@PageQuery() page: PageOption, @OrderQuery() order?: OrderOption) {
        return this.service.findAll(page, order)
    }

    @UseGuards(SelfGuard)
    @Get(':id')
    findById(@Param('id') id: string) {
        return this.service.findById(id)
    }

    @UseGuards(SelfGuard)
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
