import type { SubnetActionProps } from "../../types";

import ModelActionForm from "@/app/base/components/ModelActionForm";

type Props = Pick<SubnetActionProps, "setSidePanelContent" | "macAddress">;
const DeleteStaticIP = ({ setSidePanelContent, macAddress }: Props) => {
  if (!macAddress) return null;
  const handleClose = () => setSidePanelContent(null);
  // TODO: Implement onSubmit function and passing IDs when API supports it.
  // https://warthogs.atlassian.net/browse/MAASENG-2983
  return (
    <ModelActionForm
      aria-label="Delete static IP"
      initialValues={{}}
      modelType="static IP"
      onCancel={handleClose}
      onSubmit={() => {}}
    />
  );
};

export default DeleteStaticIP;
