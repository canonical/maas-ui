import { useRef } from "react";

import { Icon, MainTable, Spinner, Strip } from "@canonical/react-components";
import { nanoid } from "nanoid";
import { useSelector } from "react-redux";

import SubnetLink from "app/base/components/SubnetLink";
import type { RootState } from "app/store/root/types";
import subnetSelectors from "app/store/subnet/selectors";
import type { VLAN, VLANMeta } from "app/store/vlan/types";

type Props = {
  id: VLAN[VLANMeta.PK] | null;
};

const VLANSubnets = ({ id }: Props): JSX.Element | null => {
  const sectionID = useRef(nanoid());
  const subnets = useSelector((state: RootState) =>
    subnetSelectors.getByVLAN(state, id)
  );
  const subnetsLoading = useSelector(subnetSelectors.loading);

  return (
    <Strip aria-labelledby={sectionID.current} element="section" shallow>
      <h2 className="p-heading--4" id={sectionID.current}>
        Subnets on this VLAN
      </h2>
      <MainTable
        className="vlan-subnets"
        defaultSort="cidr"
        defaultSortDirection="ascending"
        emptyStateMsg={
          subnetsLoading ? (
            <Spinner text="Loading..." />
          ) : (
            "There are no subnets on this VLAN"
          )
        }
        headers={[
          {
            className: "subnet-col",
            content: "Subnet",
            sortKey: "cidr",
          },
          {
            className: "usage-col",
            content: "Usage",
            sortKey: "usage",
          },
          {
            className: "managed-col u-align--center",
            content: "Managed allocation",
            sortKey: "managed",
          },
          {
            className: "proxy-col u-align--center",
            content: "Proxy access",
            sortKey: "allow_proxy",
          },
          {
            className: "dns-col u-align--center",
            content: "Allows DNS resolution",
            sortKey: "allow_dns",
          },
        ]}
        responsive
        rows={subnets.map((subnet) => {
          const {
            allow_dns,
            allow_proxy,
            cidr,
            id,
            managed,
            statistics: { usage, usage_string },
          } = subnet;

          return {
            columns: [
              {
                "aria-label": "Subnet",
                className: "subnet-col",
                content: <SubnetLink id={id} />,
              },
              {
                "aria-label": "Usage",
                className: "used-col",
                content: usage_string,
              },
              {
                "aria-label": "Managed allocation",
                className: "managed-col u-align--center",
                content: (
                  <Icon name={managed ? "tick" : "close"}>
                    {managed ? "Yes" : "No"}
                  </Icon>
                ),
              },
              {
                "aria-label": "Proxy access",
                className: "proxy-col u-align--center",
                content: (
                  <Icon name={allow_proxy ? "tick" : "close"}>
                    {allow_proxy ? "Yes" : "No"}
                  </Icon>
                ),
              },
              {
                "aria-label": "Allows DNS resolution",
                className: "dns-col u-align--center",
                content: (
                  <Icon name={allow_dns ? "tick" : "close"}>
                    {allow_dns ? "Yes" : "No"}
                  </Icon>
                ),
              },
            ],
            sortData: {
              allow_dns,
              allow_proxy,
              cidr,
              managed,
              usage,
            },
          };
        })}
        sortable
      />
    </Strip>
  );
};

export default VLANSubnets;
