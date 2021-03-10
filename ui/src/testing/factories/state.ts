import type { RouterLocation, RouterState } from "connected-react-router";
import { array, define, random } from "cooky-cutter";

import { message } from "./message";
import { notification } from "./notification";
import { user } from "./user";

import type { ConfigState } from "app/store/config/types";
import type { ControllerState } from "app/store/controller/types";
import type { DeviceState } from "app/store/device/types";
import type { DHCPSnippetState } from "app/store/dhcpsnippet/types";
import type { DomainState } from "app/store/domain/types";
import type { FabricState } from "app/store/fabric/types";
import type {
  ArchitecturesState,
  BondOptionsState,
  ComponentsToDisableState,
  DefaultMinHweKernelState,
  GeneralState,
  HWEKernelsState,
  KnownArchitecturesState,
  MachineActionsState,
  NavigationOptionsState,
  OSInfoState,
  PocketsToDisableState,
  PowerTypesState,
  VersionState,
} from "app/store/general/types";
import type { LicenseKeysState } from "app/store/licensekeys/types";
import type {
  Machine,
  MachineState,
  MachineStatus,
  MachineStatuses,
} from "app/store/machine/types";
import type { MessageState } from "app/store/message/types";
import type { NodeDeviceState } from "app/store/nodedevice/types";
import type { NodeScriptResultState } from "app/store/nodescriptresult/types";
import type { NotificationState } from "app/store/notification/types";
import type { PackageRepositoryState } from "app/store/packagerepository/types";
import type { PodState, PodStatus, PodStatuses } from "app/store/pod/types";
import type { ResourcePoolState } from "app/store/resourcepool/types";
import type { RootState } from "app/store/root/types";
import type { ScriptResultState } from "app/store/scriptresult/types";
import type { ScriptsState } from "app/store/scripts/types";
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
  ...defaultState,
  errors: () => ({}),
  user,
});

export const configState = define<ConfigState>({
  ...defaultState,
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

export const fabricState = define<FabricState>({
  ...defaultState,
  errors: null,
});

export const licenseKeysState = define<LicenseKeysState>({
  ...defaultState,
});

export const machineStatus = define<MachineStatus>({
  aborting: false,
  acquiring: false,
  applyingStorageLayout: false,
  checkingPower: false,
  creatingBcache: false,
  creatingBond: false,
  creatingBridge: false,
  creatingCacheSet: false,
  creatingLogicalVolume: false,
  creatingPartition: false,
  creatingPhysical: false,
  creatingRaid: false,
  creatingVlan: false,
  creatingVmfsDatastore: false,
  creatingVolumeGroup: false,
  commissioning: false,
  deleting: false,
  deletingCacheSet: false,
  deletingDisk: false,
  deletingFilesystem: false,
  deletingInterface: false,
  deletingPartition: false,
  deletingVolumeGroup: false,
  deploying: false,
  enteringRescueMode: false,
  exitingRescueMode: false,
  linkingSubnet: false,
  locking: false,
  markingBroken: false,
  markingFixed: false,
  mountingSpecial: false,
  overridingFailedTesting: false,
  releasing: false,
  settingBootDisk: false,
  settingPool: false,
  settingZone: false,
  tagging: false,
  testing: false,
  turningOff: false,
  turningOn: false,
  unlocking: false,
  unlinkingSubnet: false,
  unmountingSpecial: false,
  updatingDisk: false,
  updatingFilesystem: false,
  updatingInterface: false,
  updatingVmfsDatastore: false,
});

export const machineStatuses = define<MachineStatuses>({
  testNode: machineStatus,
});

export const machineEventError = define<
  EventError<Machine, MachineState["errors"], "system_id">
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

export const scriptsState = define<ScriptsState>({
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
  items: array(user),
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
  statuses: () => ({}),
});

export const notificationState = define<NotificationState>({
  ...defaultState,
  errors: null,
  items: array(notification),
});

export const messageState = define<MessageState>({
  items: array(message),
});

export const architecturesState = define<ArchitecturesState>({
  ...defaultGeneralState,
});

export const bondOptionsState = define<BondOptionsState>({
  ...defaultGeneralState,
  data: null,
});

export const componentsToDisableState = define<ComponentsToDisableState>({
  ...defaultGeneralState,
});

export const defaultMinHweKernelState = define<DefaultMinHweKernelState>({
  ...defaultGeneralState,
  data: "",
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

export const navigationOptionsState = define<NavigationOptionsState>({
  ...defaultGeneralState,
  data: null,
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
  hweKernels: hweKernelsState,
  knownArchitectures: knownArchitecturesState,
  machineActions: machineActionsState,
  navigationOptions: navigationOptionsState,
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
  ...defaultState,
});

export const locationState = define<RouterLocation<unknown>>({
  pathname: "/",
  query: null,
  search: null,
  state: null,
  hash: null,
});

export const routerState = define<RouterState>({
  location: locationState,
  action: null,
});

export const rootState = define<RootState>({
  config: configState,
  controller: controllerState,
  device: deviceState,
  dhcpsnippet: dhcpSnippetState,
  domain: domainState,
  fabric: fabricState,
  general: generalState,
  licensekeys: licenseKeysState,
  machine: machineState,
  messages: messageState,
  nodedevice: nodeDeviceState,
  notification: notificationState,
  nodescriptresult: nodeScriptResultState,
  packagerepository: packageRepositoryState,
  pod: podState,
  resourcepool: resourcePoolState,
  router: routerState,
  scriptresult: scriptResultState,
  scripts: scriptsState,
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
