import type { DiscoveryResponse } from "@/app/apiclient";
import type { APIError } from "@/app/base/types";
import type { Model } from "@/app/store/types/model";
import type { GenericState } from "@/app/store/types/state";

export type Discovery = DiscoveryResponse & Model;

export type DiscoveryState = GenericState<Discovery, APIError>;
