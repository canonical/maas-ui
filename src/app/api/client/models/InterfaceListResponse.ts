/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InterfaceResponse } from './InterfaceResponse';
/**
 * Base class for token-paginated responses.
 * Derived classes should overwrite the items property
 */
export type InterfaceListResponse = {
    items: Array<InterfaceResponse>;
    next?: string;
    kind?: string;
};

