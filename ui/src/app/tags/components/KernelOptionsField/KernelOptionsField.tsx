import { Textarea } from "@canonical/react-components";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";

import FormikField from "app/base/components/FormikField";
import machineSelectors from "app/store/machine/selectors";
import type { Machine } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";
import tagSelectors from "app/store/tag/selectors";
import type {
  CreateParams,
  Tag,
  TagMeta,
  UpdateParams,
} from "app/store/tag/types";
import { isId } from "app/utils";

export enum Label {
  KernelOptions = "Kernel options",
}

export type Props = {
  deployedMachines?: Machine[];
  generateDeployedMessage?: (count: number) => string;
  id?: Tag[TagMeta.PK];
};

const generateDeployedMessageForExisting = (count: number) =>
  count === 1
    ? `There is ${count} deployed machine with this tag. The new kernel options will not be applied to this machine until it is redeployed.`
    : `There are ${count} deployed machines with this tag. The new kernel options will not be applied to these machines until they are redeployed.`;

export const KernelOptionsField = ({
  deployedMachines: suppliedDeployedMachines,
  generateDeployedMessage = generateDeployedMessageForExisting,
  id,
}: Props): JSX.Element => {
  const tag = useSelector((state: RootState) =>
    tagSelectors.getById(state, id)
  );
  const deployedMachinesForTag = useSelector((state: RootState) =>
    machineSelectors.getDeployedWithTag(state, id)
  );
  const deployedMachines = suppliedDeployedMachines ?? deployedMachinesForTag;
  const { values } = useFormikContext<CreateParams | UpdateParams>();
  const deployedCount = deployedMachines.length;
  const changedExistingOptions =
    isId(id) && values.kernel_opts !== tag?.kernel_opts;
  const setNewOptions = !isId(id) && values.kernel_opts;
  const hasChangedOptions = changedExistingOptions || setNewOptions;

  return (
    <FormikField
      className="p-text--code"
      label={Label.KernelOptions}
      name="kernel_opts"
      caution={
        deployedCount > 0 && hasChangedOptions
          ? generateDeployedMessage(deployedCount)
          : null
      }
      component={Textarea}
      help={
        <>
          Kernel options are appended to the kernel command line during booting
          while machines are commissioning or deploying.{" "}
          <a
            href="https://maas.io/docs/how-to-work-with-tags#heading--kernel-options"
            rel="noreferrer"
            target="_blank"
          >
            Read more about kernel options in tag management
          </a>
          .
        </>
      }
      placeholder="e.g. nomodeset console=tty0 console=ttys0,115200n8 amd_iommu=on kvm-amd.nested=1"
    />
  );
};

export default KernelOptionsField;
