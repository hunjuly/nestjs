import { ExecutionContext, createParamDecorator } from '@nestjs/common'

// import { Type, applyDecorators } from '@nestjs/common'

export class Page {
    limit: number
    offset: number

    static DEFAULT_PAGE_LIMIT = 100
    static default = { limit: this.DEFAULT_PAGE_LIMIT, offset: 0 }
}

export const PagePipe = createParamDecorator(
    (data: unknown, context: ExecutionContext): Page => {
        const request = context.switchToHttp().getRequest()

        return {
            offset: parseInt(request.query.offset, 10) || 0,
            limit: parseInt(request.query.limit, 10) || Page.DEFAULT_PAGE_LIMIT
        }
    }
    // [
    //     (target: any, key: string) => {
    //         ApiQuery({
    //             name: 'offset',
    //             schema: { default: 0, type: 'number', minimum: 0 },
    //             required: false
    //         })(target, key, Object.getOwnPropertyDescriptor(target, key))
    //         ApiQuery({
    //             name: 'limit',
    //             schema: { default: Pagination.DEFAULT_PAGE_LIMIT, type: 'number', minimum: 1 },
    //             required: false
    //         })(target, key, Object.getOwnPropertyDescriptor(target, key))
    //     }
    // ]
)

export class PaginatedList<E> extends Page {
    total: number
    items: E[]
}

// export class PaginatedResponse {
//     @ApiProperty()
//     total: number

//     @ApiProperty()
//     limit: number

//     @ApiProperty()
//     offset: number

//     @ApiProperty()
//     items: any[]
// }

// export const ApiPaginatedResponse = <TModel extends Type<any>>(model: TModel) => {
//     return applyDecorators(
//         ApiOkResponse({
//             schema: {
//                 title: `PaginatedResponseOf${model.name}`,
//                 allOf: [
//                     { $ref: getSchemaPath(PaginatedResponse) },
//                     {
//                         properties: {
//                             items: {
//                                 type: 'array',
//                                 items: { $ref: getSchemaPath(model) }
//                             }
//                         }
//                     }
//                 ]
//             }
//         })
//     )
// }
