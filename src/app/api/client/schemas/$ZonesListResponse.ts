/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ZonesListResponse = {
    description: `Base class for token-paginated responses.
    Derived classes should overwrite the items property`,
    properties: {
        items: {
            type: 'array',
            contains: {
                type: 'ZoneResponse',
            },
            isRequired: true,
        },
        next: {
            type: 'string',
        },
        kind: {
            type: 'string',
        },
    },
} as const;
