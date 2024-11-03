/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SubnetsListResponse } from '../models/SubnetsListResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class SubnetsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * List Subnets
     * @returns SubnetsListResponse Successful Response
     * @throws ApiError
     */
    public listSubnetsMaasAV3SubnetsGet({
        token,
        size = 20,
    }: {
        token?: string,
        size?: number,
    }): CancelablePromise<SubnetsListResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/MAAS/a/v3/subnets',
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
