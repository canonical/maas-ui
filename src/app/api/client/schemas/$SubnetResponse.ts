/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $SubnetResponse = {
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
        vlan: {
            type: 'BaseHref',
            isRequired: true,
        },
        cidr: {
            type: 'string',
            isRequired: true,
            format: 'ipvanynetwork',
        },
        rdns_mode: {
            type: 'number',
            isRequired: true,
        },
        gateway_ip: {
            type: 'string',
            format: 'ipvanyaddress',
        },
        dns_servers: {
            type: 'array',
            contains: {
                type: 'string',
            },
        },
        allow_dns: {
            type: 'boolean',
            isRequired: true,
        },
        allow_proxy: {
            type: 'boolean',
            isRequired: true,
        },
        active_discovery: {
            type: 'boolean',
            isRequired: true,
        },
        managed: {
            type: 'boolean',
            isRequired: true,
        },
        disabled_boot_architectures: {
            type: 'array',
            contains: {
                type: 'string',
            },
            isRequired: true,
        },
        kind: {
            type: 'string',
        },
    },
} as const;
