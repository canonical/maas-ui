/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $FabricResponse = {
    description: `Base HAL response class that every response object must extend. The response object will look like
    {
        '_links': {
            'self': {'href': '/api/v3/'}
        },
        '_embedded': {}
    }`,
    properties: {
        _links: {
            type: 'BaseHal',
        },
        _embedded: {
            type: 'dictionary',
            contains: {
                properties: {
                },
            },
        },
        id: {
            type: 'number',
            isRequired: true,
        },
        name: {
            type: 'string',
        },
        description: {
            type: 'string',
        },
        class_type: {
            type: 'string',
        },
        vlans: {
            type: 'BaseHref',
            isRequired: true,
        },
        kind: {
            type: 'string',
        },
    },
} as const;
