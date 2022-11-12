import { Body, Controller, Delete, Get, Param, Patch, Post, UseFilters, UseGuards } from '@nestjs/common'
import { AdminGuard, UserGuard } from 'src/auth'
import { DomainExceptionFilter, Page, PagePipe } from 'src/common/service'
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
    findAll(@PagePipe() page: Page) {
        return this.service.findAll(page)
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
