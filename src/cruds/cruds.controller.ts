import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseFilters,
    UseGuards
} from '@nestjs/common'
import { AdminGuard, UserGuard } from 'src/auth'
import { DomainExceptionFilter, Order, OrderQuery, Page, PageQuery } from 'src/common/service'
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
    findAll(@PageQuery() page: Page, @OrderQuery() orderby?: Order) {
        return this.service.findAll(page, orderby)
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
