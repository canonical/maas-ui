import { useCallback } from "react";

import type { ValueOf } from "@canonical/react-components";

import AddChassisForm from "./AddChassis/AddChassisForm";
import AddMachineForm from "./AddMachine/AddMachineForm";
import MachineActionFormWrapper from "./MachineActionFormWrapper";

import CreateDatastore from "app/base/components/node/StorageTables/AvailableStorageTable/BulkActions/CreateDatastore";
import CreateRaid from "app/base/components/node/StorageTables/AvailableStorageTable/BulkActions/CreateRaid";
import CreateVolumeGroup from "app/base/components/node/StorageTables/AvailableStorageTable/BulkActions/CreateVolumeGroup";
import UpdateDatastore from "app/base/components/node/StorageTables/AvailableStorageTable/BulkActions/UpdateDatastore";
import AddSpecialFilesystem from "app/base/components/node/StorageTables/FilesystemsTable/AddSpecialFilesystem";
import type { SidePanelContentTypes } from "app/base/side-panel-context";
import type { SetSearchFilter } from "app/base/types";
import { MachineSidePanelViews } from "app/machines/constants";
import type { MachineActionSidePanelViews } from "app/machines/constants";
import type {
  MachineActionVariableProps,
  MachineSidePanelContent,
} from "app/machines/types";
import AddAliasOrVlan from "app/machines/views/MachineDetails/MachineNetwork/AddAliasOrVlan";
import AddBondForm from "app/machines/views/MachineDetails/MachineNetwork/AddBondForm";
import AddBridgeForm from "app/machines/views/MachineDetails/MachineNetwork/AddBridgeForm";
import AddInterface from "app/machines/views/MachineDetails/MachineNetwork/AddInterface";
import ChangeStorageLayout from "app/machines/views/MachineDetails/MachineStorage/ChangeStorageLayout";
import { NetworkInterfaceTypes } from "app/store/types/enum";

type Props = SidePanelContentTypes & {
  setSearchFilter?: SetSearchFilter;
  viewingDetails?: boolean;
} & MachineActionVariableProps;

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
}: Props): JSX.Element | null => {
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
  const bulkActionSelected =
    extras && "bulkActionSelected" in extras
      ? extras.bulkActionSelected
      : undefined;
  const node = extras && "node" in extras ? extras.node : undefined;

  switch (sidePanelContent.view) {
    case MachineSidePanelViews.ADD_CHASSIS:
      return <AddChassisForm clearSidePanelContent={clearSidePanelContent} />;
    case MachineSidePanelViews.ADD_MACHINE:
      return <AddMachineForm clearSidePanelContent={clearSidePanelContent} />;
    case MachineSidePanelViews.CHANGE_STORAGE_LAYOUT: {
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
