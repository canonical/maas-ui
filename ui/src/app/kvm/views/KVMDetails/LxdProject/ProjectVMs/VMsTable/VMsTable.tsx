import { Spinner, Strip } from "@canonical/react-components";

import type { Machine } from "app/store/machine/types";

type Props = {
  loading?: boolean;
  vms: Machine[];
};

const VMsTable = ({ loading = false, vms }: Props): JSX.Element => {
  return (
    <Strip shallow>
      {loading ? (
        <Spinner text="Loading" />
      ) : (
        <ul>
          {vms.map((vm) => (
            <li key={vm.system_id}>{vm.hostname}</li>
          ))}
        </ul>
      )}
    </Strip>
  );
};

export default VMsTable;
