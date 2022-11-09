import { PartialType } from '@nestjs/mapped-types'
import { CreateCrudDto } from './create-crud.dto'

export class UpdateCrudDto extends PartialType(CreateCrudDto) {}
