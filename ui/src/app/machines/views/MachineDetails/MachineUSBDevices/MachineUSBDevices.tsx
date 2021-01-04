import { useSelector } from "react-redux";
import { useParams } from "react-router";

import { useWindowTitle } from "app/base/hooks";
import type { RouteParams } from "app/base/types";
import machineSelectors from "app/store/machine/selectors";
import type { RootState } from "app/store/root/types";

const MachineUSBDevices = (): JSX.Element => {
  const params = useParams<RouteParams>();
  const { id } = params;
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, id)
  );

  useWindowTitle(`${`${machine?.fqdn} ` || "Machine"} USB devices`);

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
          <th className="u-align--right">Bus address</th>
          <th className="u-align--right">Device address</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  );
};

export default MachineUSBDevices;
