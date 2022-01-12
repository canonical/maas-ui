import { useSelector } from "react-redux";

import DoubleRow from "app/base/components/DoubleRow";
import LegacyLink from "app/base/components/LegacyLink";
import baseURLs from "app/base/urls";
import controllerSelectors from "app/store/controller/selectors";
import type { Controller, ControllerMeta } from "app/store/controller/types";
import type { RootState } from "app/store/root/types";

type Props = {
  systemId: Controller[ControllerMeta.PK];
};

// Get the HA VLAN info for a controller.
const getHaVlans = (controller: Controller) => {
  const vlansHA = controller.vlans_ha;
  return (
    [
      vlansHA?.false && `Non-HA(${vlansHA.false})`,
      vlansHA?.true && `HA(${vlansHA.true})`,
    ]
      .filter(Boolean)
      .join(", ") || null
  );
};

// Get the number of VLANs for a controller.
const getVlanCount = (controller: Controller) => {
  const vlansHA = controller.vlans_ha;
  return (vlansHA?.false || 0) + (vlansHA?.true || 0);
};

export const VLANsColumn = ({ systemId }: Props): JSX.Element | null => {
  const controller = useSelector((state: RootState) =>
    controllerSelectors.getById(state, systemId)
  );

  if (!controller) {
    return null;
  }

  const haVlans = getHaVlans(controller);
  return (
    <DoubleRow
      primary={
        <LegacyLink
          route={`${baseURLs.controller({ id: systemId })}?area=vlans`}
        >
          <span data-testid="vlan-count">{getVlanCount(controller)}</span>
        </LegacyLink>
      }
      secondary={<span data-testid="ha-vlans">{haVlans}</span>}
      secondaryTitle={haVlans}
    />
  );
};

export default VLANsColumn;
