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
        export type FabricResponse = {
            _links?: BaseHal;
            _embedded?: Record<string, any>;
            id: number;
            name?: string;
            description?: string;
            class_type?: string;
            vlans: BaseHref;
            kind?: string;
        };

