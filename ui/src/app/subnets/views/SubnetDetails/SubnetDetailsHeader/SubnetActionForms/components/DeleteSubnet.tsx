import { Button } from "@canonical/react-components";

import type { SubnetActionProps } from "app/subnets/views/SubnetDetails/types";

const DeleteSubnet = ({ setActiveForm }: SubnetActionProps): JSX.Element => (
  <>
    <Button onClick={() => setActiveForm(null)}>Cancel</Button>
  </>
);

export default DeleteSubnet;
