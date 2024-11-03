/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SubnetResponse } from './SubnetResponse';
/**
 * Base class for token-paginated responses.
 * Derived classes should overwrite the items property
 */
export type SubnetsListResponse = {
    items: Array<SubnetResponse>;
    next?: string;
    kind?: string;
};

