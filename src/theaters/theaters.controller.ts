import { Body, Controller, Delete, Get, Param, Patch, Post, UseFilters, UseGuards } from '@nestjs/common'
import { AdminGuard, Public, UserGuard } from 'src/auth'
import { CreateTheaterDto, UpdateTheaterDto } from './dto'
import { TheatersService } from './theaters.service'

// import { TheaterExceptionFilter } from './user.exception-filter'

// @UseFilters(TheaterExceptionFilter)
@Controller('theaters')
export class TheatersController {
    constructor(private readonly service: TheatersService) {}
    // @Post()
    // @UseGuards(AdminGuard)
    // create(@Body() createDto: CreateTheaterDto) {
    //     return this.service.create(createDto)
    // }
    // @Get()
    // findAll() {
    //     return this.service.findAll()
    // }
    // @Get(':id')
    // findById(@Param('id') id: string) {
    //     return this.service.findById(id)
    // }
    // @Patch(':id')
    // update(@Param('id') id: string, @Body() updateDto: UpdateTheaterDto) {
    //     return this.service.update(id, updateDto)
    // }
    // @Delete(':id')
    // remove(@Param('id') id: string) {
    //     return this.service.remove(id)
    // }
}
