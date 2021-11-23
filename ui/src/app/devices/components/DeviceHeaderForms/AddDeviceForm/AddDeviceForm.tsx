import { Button } from "@canonical/react-components";

import type { ClearHeaderContent } from "app/base/types";

type Props = {
  clearHeaderContent: ClearHeaderContent;
};

const AddDeviceForm = ({ clearHeaderContent }: Props): JSX.Element | null => {
  // TODO: Build Add device form
  // https://github.com/canonical-web-and-design/app-tribe/issues/523
  return <Button onClick={clearHeaderContent}>Cancel</Button>;
};

export default AddDeviceForm;
