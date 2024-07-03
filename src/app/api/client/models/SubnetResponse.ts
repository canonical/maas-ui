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
        export type SubnetResponse = {
            _links?: BaseHal;
            _embedded?: Record<string, any>;
            id: number;
            name?: string;
            description?: string;
            vlan: BaseHref;
            cidr: string;
            rdns_mode: number;
            gateway_ip?: string;
            dns_servers?: Array<string>;
            allow_dns: boolean;
            allow_proxy: boolean;
            active_discovery: boolean;
            managed: boolean;
            disabled_boot_architectures: Array<string>;
            kind?: string;
        };

