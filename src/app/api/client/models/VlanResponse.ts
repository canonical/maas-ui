/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHal } from './BaseHal';
import type { BaseHref } from './BaseHref';
/**
 * Base HAL response class that every response object must extend. The response object will look like
 * {
     * '_links': {
         * 'self': {'href': '/api/v3/'}
         * },
         * '_embedded': {}
         * }
         */
        export type VlanResponse = {
            _links?: BaseHal;
            _embedded?: Record<string, any>;
            id: number;
            vid: number;
            name?: string;
            description: string;
            mtu: number;
            dhcp_on: boolean;
            external_dhcp?: string;
            primary_rack?: string;
            secondary_rack?: string;
            relay_vlan?: number;
            fabric: BaseHref;
            space: BaseHref;
            kind?: string;
        };

