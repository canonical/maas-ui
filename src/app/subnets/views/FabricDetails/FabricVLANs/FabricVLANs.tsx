import type { MainTableProps } from "@canonical/react-components";
import { MainTable } from "@canonical/react-components";
import { useSelector } from "react-redux";

import SpaceLink from "@/app/base/components/SpaceLink";
import SubnetLink from "@/app/base/components/SubnetLink";
import TitledSection from "@/app/base/components/TitledSection";
import VLANLink from "@/app/base/components/VLANLink";
import { useFetchActions } from "@/app/base/hooks";
import type { Fabric } from "@/app/store/fabric/types";
import type { RootState } from "@/app/store/root/types";
import { spaceActions } from "@/app/store/space";
import spaceSelectors from "@/app/store/space/selectors";
import { subnetActions } from "@/app/store/subnet";
import subnetSelectors from "@/app/store/subnet/selectors";
import type { Subnet } from "@/app/store/subnet/types";
import { getSubnetsInVLAN } from "@/app/store/subnet/utils";
import { vlanActions } from "@/app/store/vlan";
import vlanSelectors from "@/app/store/vlan/selectors";
import type { VLAN } from "@/app/store/vlan/types";
import {
  generateEmptyStateMsg,
  getTableStatus,
  simpleSortByKey,
} from "@/app/utils";

const generateRows = (vlans: VLAN[], subnets: Subnet[]) => {
  const headers = ["VLAN", "Space", "Subnet", "Available"] as const;
  const rows: MainTableProps["rows"] = [];
  const sortedVLANs = [...vlans].sort(simpleSortByKey("vid"));

  sortedVLANs.forEach((vlan) => {
    const subnetsInVlan = getSubnetsInVLAN(subnets, vlan.id);
    const vlanHasSubnets = subnetsInVlan.length > 0;

    if (!vlanHasSubnets) {
      rows.push({
        columns: [
          { "aria-label": headers[0], content: <VLANLink id={vlan.id} /> },
          { "aria-label": headers[1], content: <SpaceLink id={vlan.space} /> },
          { "aria-label": headers[2], content: "No subnets" },
          { "aria-label": headers[3], content: "—" },
        ],
      });
    } else {
      subnetsInVlan.forEach((subnet, i) => {
        rows.push({
          className: i > 0 ? "truncated-border" : "",
          columns: [
            {
              "aria-label": headers[0],
              content: (
                <span className={i > 0 ? "u-hide--large" : ""}>
                  <VLANLink id={vlan.id} />
                </span>
              ),
            },
            {
              "aria-label": headers[1],
              content: (
                <span className={i > 0 ? "u-hide--large" : ""}>
                  <SpaceLink id={vlan.space} />
                </span>
              ),
            },
            {
              "aria-label": headers[2],
              content: <SubnetLink id={subnet.id} />,
            },
            {
              "aria-label": headers[3],
              content: subnet.statistics.available_string,
            },
          ],
        });
      });
    }
  });
  return rows;
};

const FabricVLANs = ({ fabric }: { fabric: Fabric }): React.ReactElement => {
  const vlans = useSelector((state: RootState) =>
    vlanSelectors.getByFabric(state, fabric.id)
  );
  const spacesLoading = useSelector(spaceSelectors.loading);
  const subnets = useSelector(subnetSelectors.all);
  const subnetsLoading = useSelector(subnetSelectors.loading);
  const vlansLoading = useSelector(vlanSelectors.loading);
  const loading = spacesLoading || subnetsLoading || vlansLoading;

  useFetchActions([spaceActions.fetch, subnetActions.fetch, vlanActions.fetch]);
  const tableStatus = getTableStatus({ isLoading: loading });

  return (
    <TitledSection title="VLANs on this fabric">
      <MainTable
        className="fabric-vlans"
        emptyStateMsg={generateEmptyStateMsg(tableStatus, {
          default: "There are no VLANs on this fabric",
        })}
        headers={[
          {
            className: "vlan-col",
            content: "VLAN",
          },
          {
            className: "space-col",
            content: "Space",
          },
          {
            className: "subnets-col",
            content: "Subnets",
          },
          {
            className: "available-col",
            content: "Available",
          },
        ]}
        responsive
        rows={generateRows(vlans, subnets)}
      />
    </TitledSection>
  );
};

export default FabricVLANs;
