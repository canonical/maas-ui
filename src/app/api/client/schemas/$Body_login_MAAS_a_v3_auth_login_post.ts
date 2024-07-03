/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Body_login_MAAS_a_v3_auth_login_post = {
    properties: {
        grant_type: {
            type: 'string',
            pattern: 'password',
        },
        username: {
            type: 'string',
            isRequired: true,
        },
        password: {
            type: 'string',
            isRequired: true,
        },
        scope: {
            type: 'string',
        },
        client_id: {
            type: 'string',
        },
        client_secret: {
            type: 'string',
        },
    },
} as const;
