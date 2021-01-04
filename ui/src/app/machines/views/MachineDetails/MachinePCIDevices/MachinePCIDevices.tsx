import { useSelector } from "react-redux";
import { useParams } from "react-router";

import { useWindowTitle } from "app/base/hooks";
import type { RouteParams } from "app/base/types";
import machineSelectors from "app/store/machine/selectors";
import type { RootState } from "app/store/root/types";

const MachinePCIDevices = (): JSX.Element => {
  const params = useParams<RouteParams>();
  const { id } = params;
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, id)
  );

  useWindowTitle(`${`${machine?.fqdn} ` || "Machine"} PCI devices`);

  return (
    <table>
      <thead>
        <tr>
          <th></th>
          <th>
            <div>Vendor</div>
            <div>ID</div>
          </th>
          <th>Product</th>
          <th>Product ID</th>
          <th>Driver</th>
          <th className="u-align--right">NUMA node</th>
          <th className="u-align--right">PCI address</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  );
};

export default MachinePCIDevices;
