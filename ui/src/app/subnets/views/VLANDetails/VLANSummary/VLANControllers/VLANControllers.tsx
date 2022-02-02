import { Icon, Spinner, Tooltip } from "@canonical/react-components";
import { useSelector } from "react-redux";

import ControllerLink from "app/base/components/ControllerLink";
import Definition from "app/base/components/Definition";
import controllerSelectors from "app/store/controller/selectors";
import type { RootState } from "app/store/root/types";
import vlanSelectors from "app/store/vlan/selectors";
import type { VLAN, VLANMeta } from "app/store/vlan/types";
import { breakLines } from "app/utils";

type Props = {
  id: VLAN[VLANMeta.PK] | null;
};

const getRackIDs = (vlan: VLAN | null) => {
  const rackIDs = [];
  if (vlan) {
    if (vlan.primary_rack) {
      rackIDs.push(vlan.primary_rack);
    }
    if (vlan.secondary_rack) {
      rackIDs.push(vlan.secondary_rack);
    }
  }
  return rackIDs;
};

const VLANControllers = ({ id }: Props): JSX.Element | null => {
  const vlan = useSelector((state: RootState) =>
    vlanSelectors.getById(state, id)
  );
  const controllers = useSelector((state: RootState) =>
    controllerSelectors.getByIDs(state, getRackIDs(vlan))
  );
  const controllersLoading = useSelector(controllerSelectors.loading);

  if (!vlan) {
    return null;
  }
  return (
    <Definition
      label={
        <>
          Rack controllers
          <Tooltip
            className="u-nudge-right--small"
            message={breakLines(
              "A rack controller controls hosts and images and runs network services like DHCP for connected VLANs."
            )}
          >
            <Icon name="information" />
          </Tooltip>
        </>
      }
    >
      {controllersLoading ? (
        <span data-testid="Spinner">
          <Spinner />
        </span>
      ) : (
        controllers.map((controller) =>
          controller ? (
            <ControllerLink
              data-testid="ControllerLink"
              key={controller.system_id}
              {...controller}
            />
          ) : null
        )
      )}
    </Definition>
  );
};

export default VLANControllers;
