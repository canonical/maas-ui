/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { VlansListResponse } from '../models/VlansListResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class VlansService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * List Vlans
     * @returns VlansListResponse Successful Response
     * @throws ApiError
     */
    public listVlansMaasAV3VlansGet({
        token,
        size = 20,
    }: {
        token?: string,
        size?: number,
    }): CancelablePromise<VlansListResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/MAAS/a/v3/vlans',
            query: {
                'token': token,
                'size': size,
            },
            errors: {
                422: `Unprocessable Entity`,
            },
        });
    }
}
