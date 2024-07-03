/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ResourcePoolPatchRequest } from '../models/ResourcePoolPatchRequest';
import type { ResourcePoolRequest } from '../models/ResourcePoolRequest';
import type { ResourcePoolResponse } from '../models/ResourcePoolResponse';
import type { ResourcePoolsListResponse } from '../models/ResourcePoolsListResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ResourcePoolService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * List Resource Pools
     * @returns ResourcePoolsListResponse Successful Response
     * @throws ApiError
     */
    public listResourcePoolsMaasAV3ResourcePoolsGet({
        token,
        size = 20,
    }: {
        token?: string,
        size?: number,
    }): CancelablePromise<ResourcePoolsListResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/MAAS/a/v3/resource_pools',
            query: {
                'token': token,
                'size': size,
            },
            errors: {
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Create Resource Pool
     * @returns ResourcePoolResponse Successful Response
     * @throws ApiError
     */
    public createResourcePoolMaasAV3ResourcePoolsPost({
        requestBody,
    }: {
        requestBody: ResourcePoolRequest,
    }): CancelablePromise<ResourcePoolResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/MAAS/a/v3/resource_pools',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                409: `Conflict`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Get Resource Pool
     * @returns ResourcePoolResponse Successful Response
     * @throws ApiError
     */
    public getResourcePoolMaasAV3ResourcePoolsResourcePoolIdGet({
        resourcePoolId,
    }: {
        resourcePoolId: number,
    }): CancelablePromise<ResourcePoolResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/MAAS/a/v3/resource_pools/{resource_pool_id}',
            path: {
                'resource_pool_id': resourcePoolId,
            },
            errors: {
                404: `Not Found`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Patch Resource Pool
     * @returns ResourcePoolResponse Successful Response
     * @throws ApiError
     */
    public patchResourcePoolMaasAV3ResourcePoolsResourcePoolIdPatch({
        resourcePoolId,
        requestBody,
    }: {
        resourcePoolId: number,
        requestBody: ResourcePoolPatchRequest,
    }): CancelablePromise<ResourcePoolResponse> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/MAAS/a/v3/resource_pools/{resource_pool_id}',
            path: {
                'resource_pool_id': resourcePoolId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Not Found`,
                422: `Unprocessable Entity`,
            },
        });
    }
}
