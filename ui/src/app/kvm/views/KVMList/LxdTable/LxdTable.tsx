import type { ReactNode } from "react";

import { Col, MainTable, Row } from "@canonical/react-components";
import { useSelector } from "react-redux";

import CPUColumn from "../CPUColumn";
import NameColumn from "../NameColumn";
import PoolColumn from "../PoolColumn";
import RAMColumn from "../RAMColumn";
import StorageColumn from "../StorageColumn";
import VMsColumn from "../VMsColumn";

import TableHeader from "app/base/components/TableHeader";
import podSelectors from "app/store/pod/selectors";
import type { LxdServerGroup, Pod } from "app/store/pod/types";

// TODO: This should eventually extend the react-components table row type
// when it has been migrated to TypeScript.
type LxdTableRow = {
  columns: { className?: string; content: ReactNode }[];
  key: Pod["id"];
};

const generateRows = (groups: LxdServerGroup[]) =>
  groups.reduce<LxdTableRow[]>((rows, group) => {
    group.pods.forEach((pod) => {
      rows.push({
        key: pod.id,
        columns: [
          { content: <NameColumn id={pod.id} /> },
          { className: "u-align--right", content: <VMsColumn id={pod.id} /> },
          { content: <PoolColumn id={pod.id} /> },
          { content: <CPUColumn id={pod.id} /> },
          { content: <RAMColumn id={pod.id} /> },
          { content: <StorageColumn id={pod.id} /> },
        ],
      });
    });
    return rows;
  }, []);

const LxdTable = (): JSX.Element => {
  const lxdGroups = useSelector(podSelectors.groupByLxdServer);

  return (
    <Row>
      <Col size={12}>
        <MainTable
          className="kvm-list-table"
          headers={[
            {
              content: <TableHeader data-test="fqdn-header">FQDN</TableHeader>,
            },
            {
              className: "u-align--right",
              content: (
                <>
                  <TableHeader data-test="vms-header">
                    VM<span className="u-no-text-transform">s</span>
                  </TableHeader>
                  <TableHeader>Owners</TableHeader>
                </>
              ),
            },
            {
              content: (
                <>
                  <TableHeader data-test="pool-header">
                    Resource pool
                  </TableHeader>
                  <TableHeader>Az</TableHeader>
                </>
              ),
            },
            {
              content: (
                <TableHeader data-test="cpu-header">CPU cores</TableHeader>
              ),
            },
            {
              content: <TableHeader data-test="ram-header">RAM</TableHeader>,
            },
            {
              content: (
                <TableHeader data-test="storage-header">Storage</TableHeader>
              ),
            },
          ]}
          paginate={50}
          rows={generateRows(lxdGroups)}
        />
      </Col>
    </Row>
  );
};

export default LxdTable;
