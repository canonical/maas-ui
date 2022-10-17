import type { MachineActionFormProps } from "app/machines/types";
import { selectedToSeparateFilters } from "app/store/machine/utils/common";
import { useFetchMachineCount } from "app/store/machine/utils/hooks";
import type { Tag } from "app/store/tag/types";
import { FetchNodeStatus } from "app/store/types/node";
import BaseAddTagForm from "app/tags/components/AddTagForm";

export type Props = {
  name: string | null;
  onTagCreated: (tag: Tag) => void;
  viewingDetails?: boolean;
  viewingMachineConfig?: boolean;
} & Partial<MachineActionFormProps>;

export const AddTagForm = ({
  selectedMachines,
  name,
  onTagCreated,
  viewingDetails,
  viewingMachineConfig,
}: Props): JSX.Element => {
  let location = "list";
  if (viewingMachineConfig) {
    location = "configuration";
  } else if (viewingDetails) {
    location = "details";
  }

  const { groupFilters, itemFilters } = selectedMachines
    ? selectedToSeparateFilters(selectedMachines)
    : { groupFilters: null, itemFilters: null };

  const { machineCount: deployedSelectedItemsMachineCount } =
    useFetchMachineCount(
      {
        ...itemFilters,
        status: FetchNodeStatus.DEPLOYED,
      },
      { isEnabled: !!itemFilters }
    );
  const { machineCount: deployedSelectedGroupsMachineCount } =
    useFetchMachineCount(
      {
        ...groupFilters,
        status: FetchNodeStatus.DEPLOYED,
      },
      // Assume count as 0 if grouping by status and group other than deployed is selected
      {
        isEnabled:
          selectedMachines && "groups" in selectedMachines
            ? selectedMachines?.groups?.includes(FetchNodeStatus.DEPLOYED)
            : false,
      }
    );
  const deployedSelectedMachineCount =
    deployedSelectedGroupsMachineCount + deployedSelectedItemsMachineCount;

  return (
    <BaseAddTagForm
      deployedMachinesCount={deployedSelectedMachineCount}
      generateDeployedMessage={(count: number) =>
        count === 1
          ? `${count} selected machine is deployed. The new kernel options will not be applied to this machine until it is redeployed.`
          : `${count} selected machines are deployed. The new kernel options will not be applied to these machines until they are redeployed.`
      }
      name={name}
      onSaveAnalytics={{
        action: "Manual tag created",
        category: `Machine ${location} create tag form`,
        label: "Save",
      }}
      onTagCreated={onTagCreated}
    />
  );
};

export default AddTagForm;
