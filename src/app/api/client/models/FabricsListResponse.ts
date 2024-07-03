/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FabricResponse } from './FabricResponse';
/**
 * Base class for token-paginated responses.
 * Derived classes should overwrite the items property
 */
export type FabricsListResponse = {
    items: Array<FabricResponse>;
    next?: string;
    kind?: string;
};

