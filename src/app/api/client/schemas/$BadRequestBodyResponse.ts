/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $BadRequestBodyResponse = {
    properties: {
        code: {
            type: 'number',
        },
        message: {
            type: 'string',
        },
        details: {
            type: 'array',
            contains: {
                type: 'BaseExceptionDetail',
            },
        },
        kind: {
            type: 'string',
        },
    },
} as const;
