import { PickType } from '@nestjs/mapped-types'
import { CreateFileDto } from './create-file.dto'

export class CreateFilePartialDto extends PickType(CreateFileDto, ['fieldName'] as const) {}
