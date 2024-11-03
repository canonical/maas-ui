/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SpacesListResponse } from '../models/SpacesListResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class SpacesService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * List Spaces
     * @returns SpacesListResponse Successful Response
     * @throws ApiError
     */
    public listSpacesMaasAV3SpacesGet({
        token,
        size = 20,
    }: {
        token?: string,
        size?: number,
    }): CancelablePromise<SpacesListResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/MAAS/a/v3/spaces',
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
