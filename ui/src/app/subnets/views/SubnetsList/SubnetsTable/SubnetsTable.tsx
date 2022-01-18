import { Table } from "@canonical/react-components";

import { useSubnetsTable } from "./hooks";

import SubnetsControls from "app/subnets/views/SubnetsList/SubnetsControls";
import {
  TableHeader,
  FabricRow,
  SpaceRow,
} from "app/subnets/views/SubnetsList/SubnetsTable/components";
import type {
  SubnetsTableRow,
  SubnetGroupByProps,
} from "app/subnets/views/SubnetsList/SubnetsTable/types";

const FabricTable = ({
  rows,
}: {
  rows: SubnetsTableRow[] | null;
}): JSX.Element => {
  return (
    <Table role="table" className="subnets-table" aria-label="Subnets">
      <thead>
        <tr>
          <TableHeader label="Fabric" className="subnets-table__cell--fabric" />
          <TableHeader label="VLAN" className="subnets-table__cell--vlan" />
          <TableHeader label="DHCP" className="subnets-table__cell--dhcp" />
          <TableHeader label="Subnet" className="subnets-table__cell--subnet" />
          <TableHeader
            label="Available IPs"
            className="subnets-table__cell--ips"
          />
          <TableHeader
            label="Space"
            className="subnets-table__cell--space u-align--right"
          />
        </tr>
      </thead>
      <tbody>
        {rows?.map((row, i) => {
          return (
            <FabricRow
              key={`${row.sortData?.fabricId}-${row.sortData?.vlanId}-${i}`}
              {...row}
            />
          );
        })}
      </tbody>
    </Table>
  );
};

const SpaceTable = ({
  rows,
}: {
  rows: SubnetsTableRow[] | null;
}): JSX.Element => {
  return (
    <Table role="table" className="subnets-table" aria-label="Subnets">
      <thead>
        <tr>
          <TableHeader label="Space" className="subnets-table__cell--space" />
          <TableHeader label="VLAN" className="subnets-table__cell--vlan" />
          <TableHeader label="DHCP" className="subnets-table__cell--dhcp" />
          <TableHeader label="Fabric" className="subnets-table__cell--fabric" />
          <TableHeader label="Subnet" className="subnets-table__cell--subnet" />
          <TableHeader
            label="Available IPs"
            className="subnets-table__cell--ips u-align--right"
          />
        </tr>
      </thead>
      <tbody>
        {rows?.map((row, i) => (
          <SpaceRow
            key={`${row.sortData?.spaceName}-${row.sortData?.vlanId}-${i}`}
            {...row}
          />
        ))}
      </tbody>
    </Table>
  );
};

const SubnetsTable = ({
  groupBy,
  setGroupBy,
}: SubnetGroupByProps): JSX.Element | null => {
  const { rows } = useSubnetsTable(groupBy);

  return (
    <>
      <SubnetsControls groupBy={groupBy} setGroupBy={setGroupBy} />

      {groupBy === "fabric" ? (
        <FabricTable rows={rows} />
      ) : (
        <SpaceTable rows={rows} />
      )}
    </>
  );
};

export default SubnetsTable;
