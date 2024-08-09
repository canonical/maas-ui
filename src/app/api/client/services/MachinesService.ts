/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MachinesListResponse } from '../models/MachinesListResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class MachinesService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * List Machines
     * @returns MachinesListResponse Successful Response
     * @throws ApiError
     */
    public listMachinesMaasAV3MachinesGet({
        token,
        size = 20,
    }: {
        token?: string,
        size?: number,
    }): CancelablePromise<MachinesListResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/MAAS/a/v3/machines',
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
