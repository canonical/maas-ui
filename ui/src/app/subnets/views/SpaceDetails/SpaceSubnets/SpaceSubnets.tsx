import { useEffect } from "react";

import type { MainTableProps } from "@canonical/react-components";
import { Spinner, MainTable } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import FabricLink from "app/base/components/FabricLink";
import SubnetLink from "app/base/components/SubnetLink";
import TitledSection from "app/base/components/TitledSection";
import VLANLink from "app/base/components/VLANLink";
import type { RootState } from "app/store/root/types";
import type { Space } from "app/store/space/types";
import { actions as subnetActions } from "app/store/subnet";
import subnetSelectors from "app/store/subnet/selectors";
import type { Subnet } from "app/store/subnet/types";
import { actions as vlanActions } from "app/store/vlan";
import vlanSelectors from "app/store/vlan/selectors";
import type { VLAN } from "app/store/vlan/types";
import { getVlanById } from "app/store/vlan/utils";
import { simpleSortByKey } from "app/utils";

const generateRows = ({
  subnets,
  vlans,
}: {
  vlans: VLAN[];
  subnets: Subnet[];
}) => {
  const rows: MainTableProps["rows"] = [];

  if (subnets.length < 1) {
    return [];
  }
  [...subnets].sort(simpleSortByKey("cidr")).forEach((subnet: Subnet) => {
    const vlan = getVlanById(vlans, subnet.vlan) as VLAN;
    rows.push({
      columns: [
        { "aria-label": "Subnet", content: <SubnetLink id={subnet?.id} /> },
        {
          "aria-label": "Available IPs",
          content: subnet.statistics.available_string,
        },
        {
          "aria-label": "VLAN",
          content: <VLANLink id={subnet.vlan} />,
        },
        {
          "aria-label": "Fabric",
          content: <FabricLink id={vlan?.fabric} />,
        },
      ],
    });
  });

  return rows;
};

const SpaceSubnets = ({ space }: { space: Space }): JSX.Element => {
  const vlans = useSelector(vlanSelectors.all);
  const subnets = useSelector((state: RootState) =>
    subnetSelectors.getBySpace(state, space.id)
  );
  const dispatch = useDispatch();
  const vlansLoading = useSelector(vlanSelectors.loading);
  const subnetsLoading = useSelector(subnetSelectors.loading);
  const vlansLoaded = useSelector(vlanSelectors.loaded);
  const subnetsLoaded = useSelector(subnetSelectors.loaded);

  useEffect(() => {
    if (!subnetsLoaded) dispatch(subnetActions.fetch());
    if (!vlansLoaded) dispatch(vlanActions.fetch());
  }, [dispatch, subnetsLoaded, vlansLoaded]);

  const loading = vlansLoading || subnetsLoading;

  return (
    <TitledSection title="Subnets on this space">
      <MainTable
        emptyStateMsg={
          loading ? (
            <Spinner text="Loading..." />
          ) : (
            "There are no subnets on this space."
          )
        }
        headers={[
          { content: "Subnet" },
          { content: "Available IPs" },
          { content: "VLAN" },
          { content: "Fabric" },
        ]}
        rows={generateRows({ subnets, vlans })}
        responsive
      />
    </TitledSection>
  );
};

export default SpaceSubnets;
