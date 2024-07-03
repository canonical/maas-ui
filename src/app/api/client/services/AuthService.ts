/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccessTokenResponse } from '../models/AccessTokenResponse';
import type { Body_login_MAAS_a_v3_auth_login_post } from '../models/Body_login_MAAS_a_v3_auth_login_post';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AuthService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Login
     * @returns AccessTokenResponse Successful Response
     * @throws ApiError
     */
    public loginMaasAV3AuthLoginPost({
        formData,
    }: {
        formData: Body_login_MAAS_a_v3_auth_login_post,
    }): CancelablePromise<AccessTokenResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/MAAS/a/v3/auth/login',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                401: `Unauthorized`,
                422: `Unprocessable Entity`,
            },
        });
    }
}
