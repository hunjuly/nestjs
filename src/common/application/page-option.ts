import { ExecutionContext, createParamDecorator } from '@nestjs/common'

// import { Type, applyDecorators } from '@nestjs/common'

export class PageOption {
    limit: number
    offset: number

    static DEFAULT_PAGE_LIMIT = 100
    static default = { limit: this.DEFAULT_PAGE_LIMIT, offset: 0 }
}

export const PageQuery = createParamDecorator((data: unknown, context: ExecutionContext): PageOption => {
    const request = context.switchToHttp().getRequest()

    return {
        offset: parseInt(request.query.offset, 10) || 0,
        limit: parseInt(request.query.limit, 10) || PageOption.DEFAULT_PAGE_LIMIT
    }
})

export class PaginatedResult<E> extends PageOption {
    total: number
    items: E[]
}
