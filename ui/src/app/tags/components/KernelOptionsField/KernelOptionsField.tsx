import { Textarea } from "@canonical/react-components";

import FormikField from "app/base/components/FormikField";

export enum Label {
  KernelOptions = "Kernel options",
}

export const KernelOptionsField = (): JSX.Element => (
  <FormikField
    className="p-text--code"
    label={Label.KernelOptions}
    name="kernel_opts"
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

export default KernelOptionsField;
