/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ZoneResponse } from './ZoneResponse';
/**
 * Base class for token-paginated responses.
 * Derived classes should overwrite the items property
 */
export type ZonesListResponse = {
    items: Array<ZoneResponse>;
    next?: string;
    kind?: string;
};

