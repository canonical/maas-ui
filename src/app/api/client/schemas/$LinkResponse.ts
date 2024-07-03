/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $LinkResponse = {
    properties: {
        id: {
            type: 'number',
            isRequired: true,
        },
        mode: {
            type: 'IpMode',
            isRequired: true,
        },
        ip_address: {
            type: 'any-of',
            contains: [{
                type: 'string',
                format: 'ipv4',
            }, {
                type: 'string',
                format: 'ipv6',
            }],
        },
    },
} as const;
