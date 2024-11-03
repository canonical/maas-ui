/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InterfaceListResponse } from '../models/InterfaceListResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class MachineService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * List Interfaces
     * @returns InterfaceListResponse Successful Response
     * @throws ApiError
     */
    public listInterfacesMaasAV3MachinesNodeIdInterfacesGet({
        nodeId,
        token,
        size = 20,
    }: {
        nodeId: number,
        token?: string,
        size?: number,
    }): CancelablePromise<InterfaceListResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/MAAS/a/v3/machines/{node_id}/interfaces',
            path: {
                'node_id': nodeId,
            },
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
