import { Body, Controller, Delete, Get, Param, Patch, Post, UseFilters, UseGuards } from '@nestjs/common'
import { AdminGuard, UserGuard } from 'src/auth'
import { CrudExceptionFilter } from './crud.exception-filter'
import { CrudsService } from './cruds.service'
import { CreateCrudDto, UpdateCrudDto } from './dto'

@UseFilters(CrudExceptionFilter)
@Controller('cruds')
export class CrudsController {
    constructor(private readonly service: CrudsService) {}

    @Post()
    create(@Body() createDto: CreateCrudDto) {
        return this.service.create(createDto)
    }

    @Get()
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
    update(@Param('id') id: string, @Body() updateDto: UpdateCrudDto) {
        return this.service.update(id, updateDto)
    }

    @Delete(':id')
    @UseGuards(AdminGuard)
    remove(@Param('id') id: string) {
        return this.service.remove(id)
    }
}
