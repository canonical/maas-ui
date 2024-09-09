/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $MachineResponse = {
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
        system_id: {
            type: 'string',
            isRequired: true,
        },
        description: {
            type: 'string',
            isRequired: true,
        },
        owner: {
            type: 'string',
        },
        cpu_speed_MHz: {
            type: 'number',
            isRequired: true,
        },
        memory_MiB: {
            type: 'number',
            isRequired: true,
        },
        osystem: {
            type: 'string',
            isRequired: true,
        },
        architecture: {
            type: 'string',
        },
        distro_series: {
            type: 'string',
            isRequired: true,
        },
        hwe_kernel: {
            type: 'string',
        },
        locked: {
            type: 'boolean',
            isRequired: true,
        },
        cpu_count: {
            type: 'number',
            isRequired: true,
        },
        status: {
            type: 'MachineStatus',
            isRequired: true,
        },
        power_type: {
            type: 'PowerType',
            isRequired: true,
        },
        fqdn: {
            type: 'string',
            isRequired: true,
        },
        kind: {
            type: 'string',
        },
    },
} as const;
