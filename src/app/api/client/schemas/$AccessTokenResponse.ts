/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AccessTokenResponse = {
    description: `Content for a response returning a JWT.`,
    properties: {
        token_type: {
            type: 'string',
            isRequired: true,
        },
        access_token: {
            type: 'string',
            isRequired: true,
        },
        kind: {
            type: 'string',
        },
    },
} as const;
