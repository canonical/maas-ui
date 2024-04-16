import type { PropsWithChildren } from "react";
import { useState } from "react";

import { Button } from "@canonical/react-components";
import classNames from "classnames";
import { Link } from "react-router-dom";

import { SubnetsColumns } from "./constants";
import type {
  FabricRowContent,
  FabricTableRow,
  SpaceTableRow,
  SubnetsTableColumn,
  SubnetsTableRow,
} from "./types";

import GroupRow from "@/app/base/components/GroupRow";

export const SpaceCellContents = ({
  value,
}: PropsWithChildren<{
  value: SubnetsTableColumn;
}>): JSX.Element => {
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  return (
    <>
      <span
        className={
          value.isVisuallyHidden ? "subnets-table__visually-hidden" : ""
        }
      >
        {value.label === "No space" ? (
          <Button
            appearance="base"
            aria-label="No space - press to see more information"
            dense
            hasIcon
            onClick={() => setIsWarningOpen(!isWarningOpen)}
          >
            <i className="p-icon--warning"></i> <span>No space</span>
          </Button>
        ) : value.href ? (
          <Link to={value.href}>{value.label}</Link>
        ) : (
          value.label
        )}
        {isWarningOpen ? (
          <div>
            MAAS integrations require a space in order to determine the purpose
            of a network. Define a space for each subnet by selecting the space
            on the VLAN details page.
          </div>
        ) : null}
      </span>
    </>
  );
};

export const CellContents = ({
  value,
}: {
  value: SubnetsTableColumn;
}): JSX.Element => (
  <>
    <span
      className={value.isVisuallyHidden ? "subnets-table__visually-hidden" : ""}
    >
      {value.href ? <Link to={value.href}>{value.label}</Link> : value.label}
    </span>
  </>
);

const generateSubnetRow = ({
  label,
  content,
  classes,
  key,
}: {
  label?: string;
  content: FabricRowContent;
  key: string | number;
  classes?: string;
}) => {
  const columns = [
    {
      "aria-label": SubnetsColumns.FABRIC,
      key: SubnetsColumns.FABRIC,
      content: content[SubnetsColumns.FABRIC],
    },
    {
      "aria-label": SubnetsColumns.VLAN,
      key: SubnetsColumns.VLAN,
      content: content[SubnetsColumns.VLAN],
    },
    {
      "aria-label": SubnetsColumns.DHCP,
      key: SubnetsColumns.DHCP,
      content: content[SubnetsColumns.DHCP],
    },
    {
      "aria-label": SubnetsColumns.SUBNET,
      key: SubnetsColumns.SUBNET,
      content: content[SubnetsColumns.SUBNET],
    },
    {
      "aria-label": SubnetsColumns.IPS,
      key: SubnetsColumns.IPS,
      content: content[SubnetsColumns.IPS],
    },
    {
      "aria-label": SubnetsColumns.SPACE,
      key: SubnetsColumns.SPACE,
      content: content[SubnetsColumns.SPACE],
      className: "u-align--right",
    },
  ];

  return {
    "aria-label": label,
    key,
    className: classNames(classes),
    columns,
  };
};

export const generateSubnetRows = (subnets: SubnetsTableRow[]) => {
  return subnets.map((subnet, index) => {
    const content = {
      [SubnetsColumns.FABRIC]: (
        <CellContents value={subnet[SubnetsColumns.FABRIC]} />
      ),
      [SubnetsColumns.VLAN]: (
        <CellContents value={subnet[SubnetsColumns.VLAN]} />
      ),
      [SubnetsColumns.DHCP]: (
        <CellContents value={subnet[SubnetsColumns.DHCP]} />
      ),
      [SubnetsColumns.SUBNET]: (
        <CellContents value={subnet[SubnetsColumns.SUBNET]} />
      ),
      [SubnetsColumns.IPS]: <CellContents value={subnet[SubnetsColumns.IPS]} />,
      [SubnetsColumns.SPACE]: (
        <CellContents value={subnet[SubnetsColumns.SPACE]} />
      ),
    };
    return generateSubnetRow({
      label: subnet["aria-label"],
      key: `${subnet.sortData.vlanId}-${subnet.sortData.fabricId}-${index}`,
      content,
      classes: "subnet-row truncated-border",
    });
  });
};

export const generateSubnetGroupRows = ({
  itemName,
  groups,
  columnLength,
  groupMap,
}: {
  itemName: string;
  groups: FabricTableRow[] | SpaceTableRow[];
  columnLength: number;
  groupMap: Record<
    string | number,
    {
      count: number;
    }
  >;
}) => {
  const generateGroupRow = (name: string) => {
    return {
      "aria-label": `${name} group`,
      className: "",
      columns: [
        {
          colSpan: columnLength,
          content: (
            <GroupRow
              count={groupMap[name].count}
              groupName={name}
              itemName={itemName}
            />
          ),
        },
      ],
    };
  };

  return groups.flatMap((group) => {
    const { networks } = group;
    const name = "fabricName" in group ? group.fabricName : group.spaceName;
    return [generateGroupRow(name as string), ...generateSubnetRows(networks)];
  });
};
