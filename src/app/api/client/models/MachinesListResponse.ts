/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MachineResponse } from './MachineResponse';
/**
 * Base class for token-paginated responses.
 * Derived classes should overwrite the items property
 */
export type MachinesListResponse = {
    items: Array<MachineResponse>;
    next?: string;
    kind?: string;
};

