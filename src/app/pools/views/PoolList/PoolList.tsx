import { useState } from "react";

import { Col, Spinner, Notification, Row } from "@canonical/react-components";
import type { RowSelectionState } from "@tanstack/react-table";
// import { Link } from "react-router-dom";

import PoolsTable from "../../components/PoolsTable/PoolsTable";

import { usePools } from "@/app/api/query/pools";
import { useWindowTitle } from "@/app/base/hooks";

export enum Label {
  Title = "Pool list",
}

const Pools = (): JSX.Element => {
  useWindowTitle("Pools");

  const listPools = usePools();
  const [selectedRows, setSelectedRows] = useState<RowSelectionState>({});

  return (
    <div aria-label={Label.Title}>
      {listPools.isError ? (
        <Row>
          <Col size={12}>
            <Notification severity="negative">
              {listPools.error.message}
            </Notification>
          </Col>
        </Row>
      ) : null}
      <Row>
        <Col size={12}>
          <div>
            {listPools.isPending && (
              <div className="u-align--center">
                <Spinner text="Loading..." />
              </div>
            )}
            {listPools.isSuccess && (
              <PoolsTable
                selectedRows={selectedRows}
                setSelectedRows={setSelectedRows}
              />
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Pools;
