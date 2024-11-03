/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FabricsListResponse } from '../models/FabricsListResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class FabricsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * List Fabrics
     * @returns FabricsListResponse Successful Response
     * @throws ApiError
     */
    public listFabricsMaasAV3FabricsGet({
        token,
        size = 20,
    }: {
        token?: string,
        size?: number,
    }): CancelablePromise<FabricsListResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/MAAS/a/v3/fabrics',
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
