import type { Machine } from "app/store/machine/types";
import type { Tag } from "app/store/tag/types";
import { NodeStatus } from "app/store/types/node";
import BaseAddTagForm from "app/tags/components/AddTagForm";

export type Props = {
  machines: Machine[];
  name: string | null;
  onTagCreated: (tag: Tag) => void;
  viewingDetails?: boolean;
  viewingMachineConfig?: boolean;
};

export const AddTagForm = ({
  machines,
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
  return (
    <BaseAddTagForm
      deployedMachines={machines.filter(
        ({ status }) => status === NodeStatus.DEPLOYED
      )}
      // TODO: refactor to use selectedMachines https://github.com/canonical/app-tribe/issues/1417
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
