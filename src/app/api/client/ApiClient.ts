/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { FetchHttpRequest } from './core/FetchHttpRequest';
import { AuthService } from './services/AuthService';
import { FabricsService } from './services/FabricsService';
import { MachineService } from './services/MachineService';
import { MachinesService } from './services/MachinesService';
import { ResourcePoolService } from './services/ResourcePoolService';
import { SpacesService } from './services/SpacesService';
import { SubnetsService } from './services/SubnetsService';
import { VlansService } from './services/VlansService';
import { ZonesService } from './services/ZonesService';
type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;
export class ApiClient {
    public readonly auth: AuthService;
    public readonly fabrics: FabricsService;
    public readonly machine: MachineService;
    public readonly machines: MachinesService;
    public readonly resourcePool: ResourcePoolService;
    public readonly spaces: SpacesService;
    public readonly subnets: SubnetsService;
    public readonly vlans: VlansService;
    public readonly zones: ZonesService;
    public readonly request: BaseHttpRequest;
    constructor(config?: Partial<OpenAPIConfig>, HttpRequest: HttpRequestConstructor = FetchHttpRequest) {
        this.request = new HttpRequest({
            BASE: config?.BASE ?? '',
            VERSION: config?.VERSION ?? '0.1.0',
            WITH_CREDENTIALS: config?.WITH_CREDENTIALS ?? false,
            CREDENTIALS: config?.CREDENTIALS ?? 'include',
            TOKEN: config?.TOKEN,
            USERNAME: config?.USERNAME,
            PASSWORD: config?.PASSWORD,
            HEADERS: config?.HEADERS,
            ENCODE_PATH: config?.ENCODE_PATH,
        });
        this.auth = new AuthService(this.request);
        this.fabrics = new FabricsService(this.request);
        this.machine = new MachineService(this.request);
        this.machines = new MachinesService(this.request);
        this.resourcePool = new ResourcePoolService(this.request);
        this.spaces = new SpacesService(this.request);
        this.subnets = new SubnetsService(this.request);
        this.vlans = new VlansService(this.request);
        this.zones = new ZonesService(this.request);
    }
}

