/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { VlanResponse } from './VlanResponse';
/**
 * Base class for token-paginated responses.
 * Derived classes should overwrite the items property
 */
export type VlansListResponse = {
    items: Array<VlanResponse>;
    next?: string;
    kind?: string;
};

