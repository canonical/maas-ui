/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $VlanResponse = {
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
        vid: {
            type: 'number',
            isRequired: true,
        },
        name: {
            type: 'string',
        },
        description: {
            type: 'string',
            isRequired: true,
        },
        mtu: {
            type: 'number',
            isRequired: true,
        },
        dhcp_on: {
            type: 'boolean',
            isRequired: true,
        },
        external_dhcp: {
            type: 'string',
        },
        primary_rack: {
            type: 'string',
        },
        secondary_rack: {
            type: 'string',
        },
        relay_vlan: {
            type: 'number',
        },
        fabric: {
            type: 'BaseHref',
            isRequired: true,
        },
        space: {
            type: 'BaseHref',
            isRequired: true,
        },
        kind: {
            type: 'string',
        },
    },
} as const;
