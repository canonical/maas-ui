import { Col, MainTable, Row } from "@canonical/react-components";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  controller as controllerActions,
  general as generalActions,
  machine as machineActions,
  pod as podActions,
  resourcepool as poolActions,
  zone as zoneActions,
} from "app/base/actions";
import { Pod } from "app/base/types";
import { pod as podSelectors } from "app/base/selectors";
import CPUColumn from "./CPUColumn";
import NameColumn from "./NameColumn";
import OSColumn from "./OSColumn";
import PoolColumn from "./PoolColumn";
import PowerColumn from "./PowerColumn";
import RAMColumn from "./RAMColumn";
import StorageColumn from "./StorageColumn";
import TypeColumn from "./TypeColumn";
import VMsColumn from "./VMsColumn";

const generateRows = (pods: Pod[]) => {
  return pods.map((pod) => ({
    key: pod.id,
    columns: [
      { content: <NameColumn id={pod.id} /> },
      { content: <PowerColumn id={pod.id} /> },
      { content: <TypeColumn id={pod.id} /> },
      { className: "u-align--right", content: <VMsColumn id={pod.id} /> },
      { content: <OSColumn id={pod.id} /> },
      { content: <PoolColumn id={pod.id} /> },
      { content: <CPUColumn id={pod.id} /> },
      { content: <RAMColumn id={pod.id} /> },
      { content: <StorageColumn id={pod.id} /> },
    ],
  }));
};

const KVMListTable = (): JSX.Element => {
  const dispatch = useDispatch();
  const pods = useSelector(podSelectors.all);

  useEffect(() => {
    dispatch(controllerActions.fetch());
    dispatch(generalActions.fetchOsInfo());
    dispatch(machineActions.fetch());
    dispatch(podActions.fetch());
    dispatch(poolActions.fetch());
    dispatch(zoneActions.fetch());
  }, [dispatch]);

  return (
    <Row>
      <Col size={12}>
        <MainTable
          className="kvm-list-table"
          headers={[
            { content: "FQDN" },
            {
              content: (
                <span className="p-double-row__header-spacer">Power</span>
              ),
            },
            { content: "KVM Host Type" },
            {
              className: "u-align--right",
              content: (
                <>
                  <span>
                    VM<span className="u-no-text-transform">s</span>
                  </span>
                  <br />
                  <span>Owners</span>
                </>
              ),
            },
            {
              content: <span className="p-double-row__header-spacer">OS</span>,
            },
            {
              content: (
                <>
                  <span>Resource pool</span>
                  <br />
                  <span>AZ</span>
                </>
              ),
            },
            { content: "CPU" },
            { content: "RAM" },
            { content: "Storage" },
          ]}
          paginate={50}
          rows={generateRows(pods)}
        />
      </Col>
    </Row>
  );
};

export default KVMListTable;
