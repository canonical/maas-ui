import type { ReactNode } from "react";

import { Col, MainTable, Row } from "@canonical/react-components";
import classNames from "classnames";
import { useSelector } from "react-redux";

import CPUColumn from "../CPUColumn";
import NameColumn from "../NameColumn";
import PoolColumn from "../PoolColumn";
import RAMColumn from "../RAMColumn";
import StorageColumn from "../StorageColumn";
import TagsColumn from "../TagsColumn";
import VMsColumn from "../VMsColumn";

import TableHeader from "app/base/components/TableHeader";
import podSelectors from "app/store/pod/selectors";
import type { LxdServerGroup, Pod } from "app/store/pod/types";

// TODO: This should eventually extend the react-components table row type
// when it has been migrated to TypeScript.
type LxdTableRow = {
  className?: string;
  columns: { className?: string; content: ReactNode }[];
  key: Pod["id"];
};

const generateRows = (groups: LxdServerGroup[]) =>
  groups.reduce<LxdTableRow[]>((rows, group) => {
    group.pods.forEach((pod, i) => {
      const showAddress = i === 0;
      rows.push({
        key: pod.id,
        className: classNames({ "truncated-border": !showAddress }),
        columns: [
          {
            className: "address-col",
            content: showAddress ? (
              <strong data-test="lxd-address">{group.address}</strong>
            ) : null,
          },
          {
            className: "address-col",
            content: <NameColumn id={pod.id} />,
          },
          {
            className: "vms-col u-align--right",
            content: <VMsColumn id={pod.id} />,
          },
          {
            className: "tags-col",
            content: <TagsColumn id={pod.id} />,
          },
          {
            className: "pool-col",
            content: <PoolColumn id={pod.id} />,
          },
          {
            className: "cpu-col",
            content: <CPUColumn id={pod.id} />,
          },
          {
            className: "ram-col",
            content: <RAMColumn id={pod.id} />,
          },
          {
            className: "storage-col",
            content: <StorageColumn id={pod.id} />,
          },
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
          className="lxd-table"
          headers={[
            {
              className: "address-col",
              content: <TableHeader>Address</TableHeader>,
            },
            {
              className: "name-col",
              content: (
                <>
                  <TableHeader data-test="name-header">Name</TableHeader>
                  <TableHeader>Project</TableHeader>
                </>
              ),
            },
            {
              className: "vms-col u-align--right",
              content: (
                <TableHeader data-test="vms-header">
                  VM<span className="u-no-text-transform">s</span>
                </TableHeader>
              ),
            },
            {
              className: "tags-col",
              content: <TableHeader data-test="tags-header">Tags</TableHeader>,
            },
            {
              className: "pool-col",
              content: (
                <>
                  <TableHeader data-test="pool-header">
                    Resource pool
                  </TableHeader>
                  <TableHeader>AZ</TableHeader>
                </>
              ),
            },
            {
              className: "cpu-col",
              content: (
                <TableHeader data-test="cpu-header">CPU cores</TableHeader>
              ),
            },
            {
              className: "ram-col",
              content: <TableHeader data-test="ram-header">RAM</TableHeader>,
            },
            {
              className: "storage-col",
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
