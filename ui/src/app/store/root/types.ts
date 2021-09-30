import type { RouterState } from "connected-react-router";

import type {
  BootResourceState,
  BootResourceMeta,
} from "app/store/bootresource/types";
import type { ConfigState, ConfigMeta } from "app/store/config/types";
import type {
  ControllerState,
  ControllerMeta,
} from "app/store/controller/types";
import type { DeviceState, DeviceMeta } from "app/store/device/types";
import type {
  DHCPSnippetState,
  DHCPSnippetMeta,
} from "app/store/dhcpsnippet/types";
import type { DiscoveryState, DiscoveryMeta } from "app/store/discovery/types";
import type { DomainState, DomainMeta } from "app/store/domain/types";
import type { EventState, EventMeta } from "app/store/event/types";
import type { FabricState, FabricMeta } from "app/store/fabric/types";
import type { GeneralState, GeneralMeta } from "app/store/general/types";
import type {
  LicenseKeysState,
  LicenseKeysMeta,
} from "app/store/licensekeys/types";
import type { MachineState, MachineMeta } from "app/store/machine/types";
import type { MessageState, MessageMeta } from "app/store/message/types";
import type {
  NodeDeviceState,
  NodeDeviceMeta,
} from "app/store/nodedevice/types";
import type {
  NodeScriptResultState,
  NodeScriptResultMeta,
} from "app/store/nodescriptresult/types";
import type {
  NotificationState,
  NotificationMeta,
} from "app/store/notification/types";
import type {
  PackageRepositoryState,
  PackageRepositoryMeta,
} from "app/store/packagerepository/types";
import type { PodState, PodMeta } from "app/store/pod/types";
import type {
  ResourcePoolState,
  ResourcePoolMeta,
} from "app/store/resourcepool/types";
import type { ScriptState, ScriptMeta } from "app/store/script/types";
import type {
  ScriptResultState,
  ScriptResultMeta,
} from "app/store/scriptresult/types";
import type { ServiceState, ServiceMeta } from "app/store/service/types";
import type { SpaceState, SpaceMeta } from "app/store/space/types";
import type { SSHKeyState, SSHKeyMeta } from "app/store/sshkey/types";
import type { SSLKeyState, SSLKeyMeta } from "app/store/sslkey/types";
import type { StatusState, StatusMeta } from "app/store/status/types";
import type { SubnetState, SubnetMeta } from "app/store/subnet/types";
import type { TagState, TagMeta } from "app/store/tag/types";
import type { TokenState, TokenMeta } from "app/store/token/types";
import type { UserState, UserMeta } from "app/store/user/types";
import type { VLANState, VLANMeta } from "app/store/vlan/types";
import type { ZONE_MODEL } from "app/store/zone/constants";
import type { ZoneState } from "app/store/zone/types";

export type RootState = {
  [BootResourceMeta.MODEL]: BootResourceState;
  [ConfigMeta.MODEL]: ConfigState;
  [ControllerMeta.MODEL]: ControllerState;
  [DeviceMeta.MODEL]: DeviceState;
  [DHCPSnippetMeta.MODEL]: DHCPSnippetState;
  [DiscoveryMeta.MODEL]: DiscoveryState;
  [DomainMeta.MODEL]: DomainState;
  [EventMeta.MODEL]: EventState;
  [FabricMeta.MODEL]: FabricState;
  [GeneralMeta.MODEL]: GeneralState;
  [LicenseKeysMeta.MODEL]: LicenseKeysState;
  [MachineMeta.MODEL]: MachineState;
  [MessageMeta.MODEL]: MessageState;
  [NodeDeviceMeta.MODEL]: NodeDeviceState;
  [NodeScriptResultMeta.MODEL]: NodeScriptResultState;
  [NotificationMeta.MODEL]: NotificationState;
  [PackageRepositoryMeta.MODEL]: PackageRepositoryState;
  [PodMeta.MODEL]: PodState;
  [ResourcePoolMeta.MODEL]: ResourcePoolState;
  router: RouterState;
  [ScriptResultMeta.MODEL]: ScriptResultState;
  [ScriptMeta.MODEL]: ScriptState;
  [ServiceMeta.MODEL]: ServiceState;
  [SpaceMeta.MODEL]: SpaceState;
  [SSHKeyMeta.MODEL]: SSHKeyState;
  [SSLKeyMeta.MODEL]: SSLKeyState;
  [StatusMeta.MODEL]: StatusState;
  [SubnetMeta.MODEL]: SubnetState;
  [TagMeta.MODEL]: TagState;
  [TokenMeta.MODEL]: TokenState;
  [UserMeta.MODEL]: UserState;
  [VLANMeta.MODEL]: VLANState;
  [ZONE_MODEL]: ZoneState;
};
