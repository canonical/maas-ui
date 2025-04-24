import { useCallback } from "react";

import type { ValueOf } from "@canonical/react-components";

import MarkConnectedForm from "../../views/MachineDetails/MachineNetwork/MarkConnectedForm";
import { ConnectionState } from "../../views/MachineDetails/MachineNetwork/MarkConnectedForm/MarkConnectedForm";
import RemovePhysicalForm from "../../views/MachineDetails/MachineNetwork/RemovePhysicalForm";

import AddChassisForm from "./AddChassis/AddChassisForm";
import AddMachineForm from "./AddMachine/AddMachineForm";
import MachineActionFormWrapper from "./MachineActionFormWrapper";

import AddLogicalVolume from "@/app/base/components/node/StorageTables/AvailableStorageTable/AddLogicalVolume";
import AddPartition from "@/app/base/components/node/StorageTables/AvailableStorageTable/AddPartition";
import CreateDatastore from "@/app/base/components/node/StorageTables/AvailableStorageTable/BulkActions/CreateDatastore";
import CreateRaid from "@/app/base/components/node/StorageTables/AvailableStorageTable/BulkActions/CreateRaid";
import CreateVolumeGroup from "@/app/base/components/node/StorageTables/AvailableStorageTable/BulkActions/CreateVolumeGroup";
import UpdateDatastore from "@/app/base/components/node/StorageTables/AvailableStorageTable/BulkActions/UpdateDatastore";
import CreateBcache from "@/app/base/components/node/StorageTables/AvailableStorageTable/CreateBcache";
import CreateCacheSet from "@/app/base/components/node/StorageTables/AvailableStorageTable/CreateCacheSet";
import DeleteDisk from "@/app/base/components/node/StorageTables/AvailableStorageTable/DeleteDisk";
import DeletePartition from "@/app/base/components/node/StorageTables/AvailableStorageTable/DeletePartition";
import DeleteVolumeGroup from "@/app/base/components/node/StorageTables/AvailableStorageTable/DeleteVolumeGroup";
import EditDisk from "@/app/base/components/node/StorageTables/AvailableStorageTable/EditDisk";
import EditPartition from "@/app/base/components/node/StorageTables/AvailableStorageTable/EditPartition";
import SetBootDisk from "@/app/base/components/node/StorageTables/AvailableStorageTable/SetBootDisk";
import AddSpecialFilesystem from "@/app/base/components/node/StorageTables/FilesystemsTable/AddSpecialFilesystem";
import DeleteFilesystem from "@/app/base/components/node/StorageTables/FilesystemsTable/DeleteFilesystem";
import DeleteSpecialFilesystem from "@/app/base/components/node/StorageTables/FilesystemsTable/DeleteSpecialFilesystem";
import UnmountFilesystem from "@/app/base/components/node/StorageTables/FilesystemsTable/UnmountFilesystem";
import type { SidePanelContentTypes } from "@/app/base/side-panel-context";
import type { SetSearchFilter } from "@/app/base/types";
import type { MachineActionSidePanelViews } from "@/app/machines/constants";
import { MachineSidePanelViews } from "@/app/machines/constants";
import type {
  MachineActionVariableProps,
  MachineSidePanelContent,
} from "@/app/machines/types";
import AddAliasOrVlan from "@/app/machines/views/MachineDetails/MachineNetwork/AddAliasOrVlan";
import AddBondForm from "@/app/machines/views/MachineDetails/MachineNetwork/AddBondForm";
import AddBridgeForm from "@/app/machines/views/MachineDetails/MachineNetwork/AddBridgeForm";
import AddInterface from "@/app/machines/views/MachineDetails/MachineNetwork/AddInterface";
import EditInterface from "@/app/machines/views/MachineDetails/MachineNetwork/EditInterface";
import ChangeStorageLayout from "@/app/machines/views/MachineDetails/MachineStorage/ChangeStorageLayout";
import { NetworkInterfaceTypes } from "@/app/store/types/enum";

type Props = MachineActionVariableProps &
  SidePanelContentTypes & {
    setSearchFilter?: SetSearchFilter;
    viewingDetails?: boolean;
  };

/* eslint-disable complexity */
export const MachineForms = ({
  sidePanelContent,
  machines,
  setSidePanelContent,
  selectedCountLoading,
  searchFilter,
  selectedCount,
  selectedMachines,
  setSearchFilter,
  viewingDetails = false,
}: Props): React.ReactElement | null => {
  const clearSidePanelContent = useCallback(
    () => setSidePanelContent(null),
    [setSidePanelContent]
  );

  if (!sidePanelContent) {
    return null;
  }
  const { extras } = sidePanelContent;
  const systemId = extras && "systemId" in extras ? extras.systemId : undefined;
  const selectedLayout =
    extras && "selectedLayout" in extras ? extras.selectedLayout : undefined;
  const selected = extras && "selected" in extras ? extras.selected : undefined;
  const setSelected =
    extras && "setSelected" in extras ? extras.setSelected : undefined;
  const nic = extras && "nic" in extras ? extras.nic : undefined;
  const link = extras && "link" in extras ? extras.link : undefined;
  const bulkActionSelected =
    extras && "bulkActionSelected" in extras
      ? extras.bulkActionSelected
      : undefined;
  const node = extras && "node" in extras ? extras.node : undefined;
  const linkId = extras && "linkId" in extras ? extras.linkId : undefined;
  const nicId = extras && "nicId" in extras ? extras.nicId : undefined;
  const disk = extras && "disk" in extras ? extras.disk : undefined;
  const partition =
    extras && "partition" in extras ? extras.partition : undefined;
  const storageDevice =
    extras && "storageDevice" in extras ? extras.storageDevice : undefined;
  const mountPoint =
    extras && "mountPoint" in extras ? extras.mountPoint : undefined;

  switch (sidePanelContent.view) {
    case MachineSidePanelViews.ADD_CHASSIS:
      return <AddChassisForm clearSidePanelContent={clearSidePanelContent} />;
    case MachineSidePanelViews.ADD_MACHINE:
      return <AddMachineForm clearSidePanelContent={clearSidePanelContent} />;
    case MachineSidePanelViews.APPLY_STORAGE_LAYOUT: {
      if (!systemId || !selectedLayout) {
        return null;
      }
      return (
        <ChangeStorageLayout
          clearSidePanelContent={clearSidePanelContent}
          selectedLayout={selectedLayout}
          systemId={systemId}
        />
      );
    }
    case MachineSidePanelViews.ADD_INTERFACE: {
      if (!systemId) return null;
      return <AddInterface close={clearSidePanelContent} systemId={systemId} />;
    }
    case MachineSidePanelViews.ADD_BOND: {
      if (!setSelected || !systemId) return null;
      return (
        <AddBondForm
          close={clearSidePanelContent}
          selected={selected || []}
          setSelected={setSelected}
          systemId={systemId}
        />
      );
    }
    case MachineSidePanelViews.ADD_BRIDGE: {
      if (!setSelected || !systemId) return null;
      return (
        <AddBridgeForm
          close={clearSidePanelContent}
          selected={selected || []}
          setSelected={setSelected}
          systemId={systemId}
        />
      );
    }
    case MachineSidePanelViews.ADD_ALIAS: {
      if (!systemId) return null;
      return (
        <AddAliasOrVlan
          close={clearSidePanelContent}
          interfaceType={NetworkInterfaceTypes.ALIAS}
          nic={nic}
          systemId={systemId}
        />
      );
    }
    case MachineSidePanelViews.ADD_SPECIAL_FILESYSTEM: {
      if (!node) return null;
      return (
        <AddSpecialFilesystem
          closeForm={clearSidePanelContent}
          machine={node}
        />
      );
    }
    case MachineSidePanelViews.ADD_VLAN: {
      if (!systemId) return null;
      return (
        <AddAliasOrVlan
          close={clearSidePanelContent}
          interfaceType={NetworkInterfaceTypes.VLAN}
          nic={nic}
          systemId={systemId}
        />
      );
    }
    case MachineSidePanelViews.CREATE_BCACHE: {
      if (!systemId || (!disk && !partition)) return null;
      return (
        <CreateBcache
          closeExpanded={clearSidePanelContent}
          storageDevice={disk ? disk : partition!}
          systemId={systemId}
        />
      );
    }
    case MachineSidePanelViews.CREATE_CACHE_SET: {
      if (!systemId || (!disk && !partition)) return null;
      return (
        <CreateCacheSet
          close={clearSidePanelContent}
          diskId={disk?.id}
          partitionId={partition?.id}
          systemId={systemId}
        />
      );
    }
    case MachineSidePanelViews.CREATE_DATASTORE: {
      if (!bulkActionSelected || !systemId) return null;
      return (
        <CreateDatastore
          closeForm={clearSidePanelContent}
          selected={bulkActionSelected}
          systemId={systemId}
        />
      );
    }
    case MachineSidePanelViews.CREATE_LOGICAL_VOLUME: {
      if (!systemId || !disk) return null;
      return (
        <AddLogicalVolume
          closeExpanded={clearSidePanelContent}
          disk={disk}
          systemId={systemId}
        />
      );
    }
    case MachineSidePanelViews.CREATE_PARTITION: {
      if (!systemId || !disk) return null;
      return (
        <AddPartition
          closeExpanded={clearSidePanelContent}
          disk={disk}
          systemId={systemId}
        />
      );
    }
    case MachineSidePanelViews.CREATE_RAID: {
      if (!bulkActionSelected || !systemId) return null;
      return (
        <CreateRaid
          closeForm={clearSidePanelContent}
          selected={bulkActionSelected}
          systemId={systemId}
        />
      );
    }
    case MachineSidePanelViews.CREATE_VOLUME_GROUP: {
      if (!bulkActionSelected || !systemId) return null;
      return (
        <CreateVolumeGroup
          closeForm={clearSidePanelContent}
          selected={bulkActionSelected}
          systemId={systemId}
        />
      );
    }
    case MachineSidePanelViews.DELETE_DISK: {
      if (!disk || !systemId) return null;
      return (
        <DeleteDisk
          close={clearSidePanelContent}
          disk={disk}
          systemId={systemId}
        />
      );
    }
    case MachineSidePanelViews.DELETE_FILESYSTEM: {
      if (!storageDevice || !systemId) return null;
      return (
        <DeleteFilesystem
          close={clearSidePanelContent}
          storageDevice={storageDevice}
          systemId={systemId}
        />
      );
    }
    case MachineSidePanelViews.DELETE_SPECIAL_FILESYSTEM: {
      if (!mountPoint || !systemId) return null;
      return (
        <DeleteSpecialFilesystem
          close={clearSidePanelContent}
          mountPoint={mountPoint}
          systemId={systemId}
        />
      );
    }
    case MachineSidePanelViews.DELETE_VOLUME_GROUP: {
      if (!disk || !systemId) return null;
      return (
        <DeleteVolumeGroup
          close={clearSidePanelContent}
          diskId={disk.id}
          systemId={systemId}
        />
      );
    }
    case MachineSidePanelViews.EDIT_DISK: {
      if (!disk || !systemId) return null;
      return (
        <EditDisk
          closeExpanded={clearSidePanelContent}
          disk={disk}
          systemId={systemId}
        />
      );
    }
    case MachineSidePanelViews.EDIT_PARTITION: {
      if (!disk || !partition || !systemId) return null;
      return (
        <EditPartition
          closeExpanded={clearSidePanelContent}
          disk={disk}
          partition={partition}
          systemId={systemId}
        />
      );
    }
    case MachineSidePanelViews.EDIT_PHYSICAL: {
      if (!systemId || !selected || !setSelected) return null;
      return (
        <EditInterface
          close={clearSidePanelContent}
          linkId={linkId}
          nicId={nicId}
          selected={selected}
          setSelected={setSelected}
          systemId={systemId}
        />
      );
    }
    case MachineSidePanelViews.MARK_CONNECTED: {
      if (!systemId) return null;
      return (
        <MarkConnectedForm
          close={clearSidePanelContent}
          connectionState={ConnectionState.MARK_CONNECTED}
          link={link}
          nic={nic}
          systemId={systemId}
        />
      );
    }
    case MachineSidePanelViews.MARK_DISCONNECTED: {
      if (!systemId) return null;
      return (
        <MarkConnectedForm
          close={clearSidePanelContent}
          connectionState={ConnectionState.MARK_DISCONNECTED}
          link={link}
          nic={nic}
          systemId={systemId}
        />
      );
    }
    case MachineSidePanelViews.REMOVE_PARTITION: {
      if (!partition || !systemId) return null;
      return (
        <DeletePartition
          close={clearSidePanelContent}
          partitionId={partition.id}
          systemId={systemId}
        />
      );
    }
    case MachineSidePanelViews.REMOVE_PHYSICAL: {
      if (!systemId) return null;
      return (
        <RemovePhysicalForm
          close={clearSidePanelContent}
          link={link}
          nic={nic}
          systemId={systemId}
        />
      );
    }
    case MachineSidePanelViews.SET_BOOT_DISK: {
      if (!systemId || !disk) return null;
      return (
        <SetBootDisk
          close={clearSidePanelContent}
          diskId={disk.id}
          systemId={systemId}
        />
      );
    }
    case MachineSidePanelViews.UNMOUNT_FILESYSTEM: {
      if (!storageDevice || !systemId) return null;
      return (
        <UnmountFilesystem
          close={clearSidePanelContent}
          storageDevice={storageDevice}
          systemId={systemId}
        />
      );
    }
    case MachineSidePanelViews.UPDATE_DATASTORE: {
      if (!bulkActionSelected || !systemId) return null;
      return (
        <UpdateDatastore
          closeForm={clearSidePanelContent}
          selected={bulkActionSelected}
          systemId={systemId}
        />
      );
    }

    default:
      // We need to explicitly cast sidePanelContent.view here - TypeScript doesn't
      // seem to be able to infer remaining object tuple values as with string
      // values.
      // https://github.com/canonical/maas-ui/issues/3040
      const { extras, view } = sidePanelContent as {
        extras: MachineSidePanelContent["extras"];
        view: ValueOf<typeof MachineActionSidePanelViews>;
      };
      const applyConfiguredNetworking =
        extras && "applyConfiguredNetworking" in extras
          ? extras.applyConfiguredNetworking
          : undefined;
      const hardwareType =
        extras && "hardwareType" in extras ? extras.hardwareType : undefined;
      const [, action] = view;
      const conditionalProps = machines
        ? { machines }
        : {
            selectedCount,
            selectedCountLoading,
            selectedMachines,
            searchFilter,
          };
      return (
        <MachineActionFormWrapper
          action={action}
          applyConfiguredNetworking={applyConfiguredNetworking}
          clearSidePanelContent={clearSidePanelContent}
          hardwareType={hardwareType}
          setSearchFilter={setSearchFilter}
          viewingDetails={viewingDetails}
          {...conditionalProps}
        />
      );
  }
};

export default MachineForms;
