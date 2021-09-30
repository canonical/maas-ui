import type { RouterLocation, RouterState } from "connected-react-router";
import { define, random } from "cooky-cutter";

import { bondOptions } from "./general";

import type { APIError } from "app/base/types";
import type { BootResourceState } from "app/store/bootresource/types";
import type { ConfigState } from "app/store/config/types";
import type { ControllerState } from "app/store/controller/types";
import type { DeviceState } from "app/store/device/types";
import type { DHCPSnippetState } from "app/store/dhcpsnippet/types";
import type { DiscoveryState } from "app/store/discovery/types";
import type { DomainState } from "app/store/domain/types";
import type { EventState } from "app/store/event/types";
import type { FabricState } from "app/store/fabric/types";
import type {
  ArchitecturesState,
  BondOptionsState,
  ComponentsToDisableState,
  DefaultMinHweKernelState,
  GeneralState,
  GeneratedCertificateState,
  HWEKernelsState,
  KnownArchitecturesState,
  MachineActionsState,
  OSInfoState,
  PocketsToDisableState,
  PowerTypesState,
  VersionState,
} from "app/store/general/types";
import type { LicenseKeysState } from "app/store/licensekeys/types";
import { DEFAULT_STATUSES } from "app/store/machine";
import type {
  Machine,
  MachineState,
  MachineStatus,
  MachineStatuses,
} from "app/store/machine/types";
import type { MachineEventErrors } from "app/store/machine/types/base";
import type { MessageState } from "app/store/message/types";
import type { NodeDeviceState } from "app/store/nodedevice/types";
import type { NodeScriptResultState } from "app/store/nodescriptresult/types";
import type { NotificationState } from "app/store/notification/types";
import type { PackageRepositoryState } from "app/store/packagerepository/types";
import type { PodState, PodStatus, PodStatuses } from "app/store/pod/types";
import type { ResourcePoolState } from "app/store/resourcepool/types";
import type { RootState } from "app/store/root/types";
import type { ScriptState } from "app/store/script/types";
import type { ScriptResultState } from "app/store/scriptresult/types";
import type { ServiceState } from "app/store/service/types";
import type { SpaceState } from "app/store/space/types";
import type { SSHKeyState } from "app/store/sshkey/types";
import type { SSLKeyState } from "app/store/sslkey/types";
import type { StatusState } from "app/store/status/types";
import type { SubnetState } from "app/store/subnet/types";
import type { TagState } from "app/store/tag/types";
import type { TokenState } from "app/store/token/types";
import type { EventError } from "app/store/types/state";
import type { AuthState, UserState } from "app/store/user/types";
import type { VLANState } from "app/store/vlan/types";
import { ZONE_ACTIONS } from "app/store/zone/constants";
import type { ZoneState } from "app/store/zone/types";

const defaultState = {
  errors: () => ({}),
  items: () => [],
  loaded: false,
  loading: false,
  saved: false,
  saving: false,
};

const defaultGeneralState = {
  errors: () => ({}),
  data: () => [],
  loaded: false,
  loading: false,
};

export const authState = define<AuthState>({
  errors: null,
  loaded: false,
  loading: false,
  saved: false,
  saving: false,
  user: null,
});

export const bootResourceState = define<BootResourceState>({
  connectionError: false,
  eventErrors: () => [],
  fetchedImages: null,
  otherImages: () => [],
  rackImportRunning: false,
  regionImportRunning: false,
  resources: () => [],
  statuses: () => ({
    deletingImage: false,
    fetching: false,
    polling: false,
    savingOther: false,
    savingUbuntuCore: false,
    savingUbuntu: false,
    stoppingImport: false,
  }),
  ubuntu: null,
  ubuntuCoreImages: () => [],
});

export const configState = define<ConfigState>({
  ...defaultState,
  errors: null,
});

export const controllerState = define<ControllerState>({
  ...defaultState,
  errors: null,
});

export const deviceState = define<DeviceState>({
  ...defaultState,
});

export const dhcpSnippetState = define<DHCPSnippetState>({
  ...defaultState,
  errors: null,
});

export const discoveryState = define<DiscoveryState>({
  ...defaultState,
  errors: null,
});

export const eventState = define<EventState>({
  ...defaultState,
  errors: null,
});

export const fabricState = define<FabricState>({
  ...defaultState,
  errors: null,
});

export const licenseKeysState = define<LicenseKeysState>({
  ...defaultState,
});

export const machineStatus = define<MachineStatus>(DEFAULT_STATUSES);

export const machineStatuses = define<MachineStatuses>({
  testNode: machineStatus,
});

export const machineEventError = define<
  EventError<Machine, APIError<MachineEventErrors>, "system_id">
>({
  id: random().toString(),
  error: "Uh oh",
  event: "tag",
});

export const machineState = define<MachineState>({
  ...defaultState,
  active: null,
  eventErrors: () => [],
  selected: () => [],
  statuses: () => ({}),
});

export const scriptState = define<ScriptState>({
  ...defaultState,
});

export const spaceState = define<SpaceState>({
  ...defaultState,
  errors: null,
});

export const sshKeyState = define<SSHKeyState>({
  ...defaultState,
  errors: null,
});

export const sslKeyState = define<SSLKeyState>({
  ...defaultState,
  errors: null,
});

export const tokenState = define<TokenState>({
  ...defaultState,
  errors: null,
});

export const packageRepositoryState = define<PackageRepositoryState>({
  ...defaultState,
  errors: null,
});

export const userState = define<UserState>({
  ...defaultState,
  auth: authState,
  errors: null,
  eventErrors: () => [],
  statuses: () => ({
    markingIntroComplete: false,
  }),
});

export const podStatus = define<PodStatus>({
  composing: false,
  deleting: false,
  refreshing: false,
});

export const podStatuses = define<PodStatuses>({
  1: podStatus,
});

export const podState = define<PodState>({
  ...defaultState,
  active: null,
  errors: null,
  projects: () => ({}),
  statuses: () => ({}),
});

export const notificationState = define<NotificationState>({
  ...defaultState,
  errors: null,
});

export const messageState = define<MessageState>({
  items: () => [],
});

export const architecturesState = define<ArchitecturesState>({
  ...defaultGeneralState,
});

export const bondOptionsState = define<BondOptionsState>({
  ...defaultGeneralState,
  data: () => bondOptions(),
});

export const componentsToDisableState = define<ComponentsToDisableState>({
  ...defaultGeneralState,
});

export const defaultMinHweKernelState = define<DefaultMinHweKernelState>({
  ...defaultGeneralState,
  data: "",
});

export const generatedCertificateState = define<GeneratedCertificateState>({
  ...defaultGeneralState,
  data: null,
});

export const hweKernelsState = define<HWEKernelsState>({
  ...defaultGeneralState,
});

export const knownArchitecturesState = define<KnownArchitecturesState>({
  ...defaultGeneralState,
});

export const machineActionsState = define<MachineActionsState>({
  ...defaultGeneralState,
  data: () => [],
});

export const osInfoState = define<OSInfoState>({
  ...defaultGeneralState,
  data: null,
});

export const pocketsToDisableState = define<PocketsToDisableState>({
  ...defaultGeneralState,
});

export const powerTypesState = define<PowerTypesState>({
  ...defaultGeneralState,
});

export const versionState = define<VersionState>({
  ...defaultGeneralState,
  data: "",
});

export const generalState = define<GeneralState>({
  architectures: architecturesState,
  bondOptions: bondOptionsState,
  componentsToDisable: componentsToDisableState,
  defaultMinHweKernel: defaultMinHweKernelState,
  generatedCertificate: generatedCertificateState,
  hweKernels: hweKernelsState,
  knownArchitectures: knownArchitecturesState,
  machineActions: machineActionsState,
  osInfo: osInfoState,
  pocketsToDisable: pocketsToDisableState,
  powerTypes: powerTypesState,
  version: versionState,
});

export const statusState = define<StatusState>({
  authenticated: false,
  authenticating: false,
  authenticationError: null,
  connected: false,
  connecting: false,
  error: null,
  externalAuthURL: "http://example.com/auth",
  externalLoginURL: "http://example.com/login",
  noUsers: false,
});

export const domainState = define<DomainState>({
  ...defaultState,
  active: null,
  errors: null,
});

export const nodeDeviceState = define<NodeDeviceState>({
  ...defaultState,
});

export const nodeScriptResultState = define<NodeScriptResultState>({
  items: () => ({}),
});

export const resourcePoolState = define<ResourcePoolState>({
  ...defaultState,
});

export const scriptResultState = define<ScriptResultState>({
  ...defaultState,
  history: () => ({}),
  logs: () => null,
});

export const serviceState = define<ServiceState>({
  ...defaultState,
  errors: null,
});

export const subnetState = define<SubnetState>({
  ...defaultState,
  errors: null,
});

export const tagState = define<TagState>({
  ...defaultState,
});

export const vlanState = define<VLANState>({
  ...defaultState,
});

export const zoneState = define<ZoneState>({
  errors: [],
  items: [],
  loaded: false,
  loading: false,
  processes: {
    [ZONE_ACTIONS.delete]: { processing: [], successful: [] },
    [ZONE_ACTIONS.update]: { processing: [], successful: [] },
  },
  saved: false,
  saving: false,
});

export const locationState = define<RouterLocation<unknown>>({
  pathname: "/",
  query: () => ({}),
  search: "",
  state: null,
  hash: "",
});

export const routerState = define<RouterState>({
  location: locationState,
  action: "POP",
});

export const rootState = define<RootState>({
  bootresource: bootResourceState,
  config: configState,
  controller: controllerState,
  device: deviceState,
  discovery: discoveryState,
  event: eventState,
  dhcpsnippet: dhcpSnippetState,
  domain: domainState,
  fabric: fabricState,
  general: generalState,
  licensekeys: licenseKeysState,
  machine: machineState,
  message: messageState,
  nodedevice: nodeDeviceState,
  notification: notificationState,
  nodescriptresult: nodeScriptResultState,
  packagerepository: packageRepositoryState,
  pod: podState,
  resourcepool: resourcePoolState,
  router: routerState,
  scriptresult: scriptResultState,
  script: scriptState,
  service: serviceState,
  space: spaceState,
  sshkey: sshKeyState,
  sslkey: sslKeyState,
  status: statusState,
  subnet: subnetState,
  tag: tagState,
  token: tokenState,
  user: userState,
  vlan: vlanState,
  zone: zoneState,
});
