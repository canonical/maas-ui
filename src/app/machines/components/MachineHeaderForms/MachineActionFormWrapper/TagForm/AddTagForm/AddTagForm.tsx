import type { MachineActionFormProps } from "app/machines/types";
import { useFetchDeployedMachineCount } from "app/store/machine/utils/hooks";
import type { Tag } from "app/store/tag/types";
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
  searchFilter,
  viewingDetails,
  viewingMachineConfig,
}: Props): JSX.Element => {
  let location = "list";
  if (viewingMachineConfig) {
    location = "configuration";
  } else if (viewingDetails) {
    location = "details";
  }

  const { machineCount: deployedSelectedMachineCount } =
    useFetchDeployedMachineCount({ selectedMachines, searchFilter });

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
