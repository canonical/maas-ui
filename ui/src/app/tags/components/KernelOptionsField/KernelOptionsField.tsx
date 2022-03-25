import { Textarea } from "@canonical/react-components";
import { useSelector } from "react-redux";

import FormikField from "app/base/components/FormikField";
import machineSelectors from "app/store/machine/selectors";
import type { RootState } from "app/store/root/types";
import type { Tag, TagMeta } from "app/store/tag/types";

export enum Label {
  KernelOptions = "Kernel options",
}

type Props = {
  id?: Tag[TagMeta.PK];
};

const generateDeployedMessage = (count: number) =>
  count === 1
    ? `There is ${count} deployed machine with this tag. The new kernel options will not be applied to this machine until it is redeployed.`
    : `There are ${count} deployed machines with this tag. The new kernel options will not be applied to these machines until they are redeployed.`;

export const KernelOptionsField = ({ id }: Props): JSX.Element => {
  const deployedMachines = useSelector((state: RootState) =>
    machineSelectors.getDeployedWithTag(state, id)
  );
  const deployedCount = deployedMachines.length;

  return (
    <FormikField
      className="p-text--code"
      label={Label.KernelOptions}
      name="kernel_opts"
      caution={
        deployedCount > 0 ? generateDeployedMessage(deployedCount) : null
      }
      component={Textarea}
      help={
        // TODO: Add the link to the docs:
        // https://github.com/canonical-web-and-design/app-tribe/issues/748
        <>
          Kernel options are appended to the kernel command line during booting
          while machines are commissioning or deploying. Read more about kernel
          options in <a href="#todo">tag management.</a>
        </>
      }
      placeholder="e.g. nomodeset console=tty0 console=ttys0,115200n8 amd_iommu=on kvm-amd.nested=1"
    />
  );
};

export default KernelOptionsField;
