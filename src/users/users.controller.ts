import {
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    Param,
    Patch,
    Post,
    Request,
    UseFilters,
    UseGuards
} from '@nestjs/common'
import {
    DomainExceptionFilter,
    OrderOption,
    OrderQuery,
    PageOption,
    PageQuery
} from 'src//common/application'
import { AdminGuard, MemberGuard } from 'src/auths'
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

    @UseGuards(AdminGuard)
    @Get()
    findAll(@PageQuery() page: PageOption, @OrderQuery() order?: OrderOption) {
        return this.service.findAll(page, order)
    }

    @UseGuards(MemberGuard)
    @Get(':id')
    findById(@Param('id') id: string) {
        return this.service.findById(id)
    }

    @UseGuards(MemberGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateDto: UpdateUserDto) {
        return this.service.update(id, updateDto)
    }

    @UseGuards(MemberGuard)
    @Delete(':id')
    remove(@Request() req, @Param('id') id: string) {
        if (req.user.role === 'admin' || id === req.user.id) {
            return this.service.remove(id)
        }

        throw new ForbiddenException()
    }
}
