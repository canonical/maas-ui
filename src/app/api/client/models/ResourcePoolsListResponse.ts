/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ResourcePoolResponse } from './ResourcePoolResponse';
/**
 * Base class for token-paginated responses.
 * Derived classes should overwrite the items property
 */
export type ResourcePoolsListResponse = {
    items: Array<ResourcePoolResponse>;
    next?: string;
    kind?: string;
};

