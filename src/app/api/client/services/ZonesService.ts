/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ZoneRequest } from '../models/ZoneRequest';
import type { ZoneResponse } from '../models/ZoneResponse';
import type { ZonesListResponse } from '../models/ZonesListResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ZonesService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * List Zones
     * @returns ZonesListResponse Successful Response
     * @throws ApiError
     */
    public listZonesMaasAV3ZonesGet({
        token,
        size = 20,
    }: {
        token?: string,
        size?: number,
    }): CancelablePromise<ZonesListResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/MAAS/a/v3/zones',
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
     * Create Zone
     * @returns ZoneResponse Successful Response
     * @throws ApiError
     */
    public createZoneMaasAV3ZonesPost({
        requestBody,
    }: {
        requestBody: ZoneRequest,
    }): CancelablePromise<ZoneResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/MAAS/a/v3/zones',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                409: `Conflict`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Get Zone
     * @returns ZoneResponse Successful Response
     * @throws ApiError
     */
    public getZoneMaasAV3ZonesZoneIdGet({
        zoneId,
    }: {
        zoneId: number,
    }): CancelablePromise<ZoneResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/MAAS/a/v3/zones/{zone_id}',
            path: {
                'zone_id': zoneId,
            },
            errors: {
                404: `Not Found`,
                422: `Unprocessable Entity`,
            },
        });
    }
    /**
     * Delete Zone
     * Deletes a zone. All the resources belonging to this zone will be moved to the default zone.
     * @returns void
     * @throws ApiError
     */
    public deleteZoneMaasAV3ZonesZoneIdDelete({
        zoneId,
        ifMatch,
    }: {
        zoneId: number,
        ifMatch?: string,
    }): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/MAAS/a/v3/zones/{zone_id}',
            path: {
                'zone_id': zoneId,
            },
            headers: {
                'if-match': ifMatch,
            },
            errors: {
                400: `Bad Request`,
                404: `Not Found`,
                422: `Validation Error`,
            },
        });
    }
}
