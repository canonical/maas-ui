/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $InterfaceResponse = {
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
            isRequired: true,
        },
        type: {
            type: 'InterfaceType',
            isRequired: true,
        },
        mac_address: {
            type: 'string',
        },
        link_connected: {
            type: 'boolean',
        },
        interface_speed: {
            type: 'number',
        },
        enabled: {
            type: 'boolean',
        },
        link_speed: {
            type: 'number',
        },
        sriov_max_vf: {
            type: 'number',
        },
        links: {
            type: 'array',
            contains: {
                type: 'LinkResponse',
            },
        },
        kind: {
            type: 'string',
        },
    },
} as const;
