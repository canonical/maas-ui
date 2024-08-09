/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHal } from './BaseHal';
import type { InterfaceType } from './InterfaceType';
import type { LinkResponse } from './LinkResponse';
/**
 * Base HAL response class that every response object must extend. The response object will look like
 * {
     * '_links': {
         * 'self': {'href': '/api/v3/'}
         * },
         * '_embedded': {}
         * }
         */
        export type InterfaceResponse = {
            _links?: BaseHal;
            _embedded?: Record<string, any>;
            id: number;
            name: string;
            type: InterfaceType;
            mac_address?: string;
            link_connected?: boolean;
            interface_speed?: number;
            enabled?: boolean;
            link_speed?: number;
            sriov_max_vf?: number;
            links?: Array<LinkResponse>;
            kind?: string;
        };

