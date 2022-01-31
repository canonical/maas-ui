import { Button } from "@canonical/react-components";

import type { SubnetActionProps } from "app/subnets/views/SubnetDetails/types";

const EditBootArchitectures = ({
  setActiveForm,
}: SubnetActionProps): JSX.Element => (
  <>
    <Button onClick={() => setActiveForm(null)}>Cancel</Button>
  </>
);

export default EditBootArchitectures;
