/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHal } from './BaseHal';
import type { MachineStatus } from './MachineStatus';
import type { PowerType } from './PowerType';
/**
 * Base HAL response class that every response object must extend. The response object will look like
 * {
     * '_links': {
         * 'self': {'href': '/api/v3/'}
         * },
         * '_embedded': {}
         * }
         */
        export type MachineResponse = {
            _links?: BaseHal;
            _embedded?: Record<string, any>;
            id: number;
            system_id: string;
            description: string;
            owner?: string;
            cpu_speed_MHz: number;
            memory_MiB: number;
            osystem: string;
            architecture?: string;
            distro_series: string;
            hwe_kernel?: string;
            locked: boolean;
            cpu_count: number;
            status: MachineStatus;
            power_type: PowerType;
            fqdn: string;
            kind?: string;
        };

