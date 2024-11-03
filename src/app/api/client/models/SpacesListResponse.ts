/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SpaceResponse } from './SpaceResponse';
/**
 * Base class for token-paginated responses.
 * Derived classes should overwrite the items property
 */
export type SpacesListResponse = {
    items: Array<SpaceResponse>;
    next?: string;
    kind?: string;
};

