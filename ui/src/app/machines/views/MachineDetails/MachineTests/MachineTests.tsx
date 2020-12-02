import { useEffect } from "react";

import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import MachineTestsTable from "./MachineTestsTable";

import { HardwareType, ResultType } from "app/base/enum";
import { useWindowTitle } from "app/base/hooks";
import type { RouteParams } from "app/base/types";
import machineSelectors from "app/store/machine/selectors";
import { actions as nodeResultActions } from "app/store/noderesult";
import nodeResultSelectors from "app/store/noderesult/selectors";
import type { NodeResult, NodeResults } from "app/store/noderesult/types";
import type { RootState } from "app/store/root/types";

/**
 * Group items by key
 * @param results a node results list
 * @param key
 */
const groupByKey = <I,>(items: I[], key: keyof I): { [x: string]: I[] } =>
  items.reduce((obj, item) => {
    obj[item[key]] = obj[item[key]] || [];
    obj[item[key]].push(item);
    return obj;
  }, Object.create(null));

const getTestingResults = (nodeResults: NodeResults): NodeResult[] =>
  nodeResults.results.filter(
    (result) => result.result_type === ResultType.Testing
  );

const getHardwareResults = (nodeResults: NodeResults) =>
  groupByKey(
    getTestingResults(nodeResults).filter(
      (result) =>
        result.hardware_type === HardwareType.CPU ||
        result.hardware_type === HardwareType.Memory ||
        result.hardware_type === HardwareType.Network
    ),
    "hardware_type"
  );

const getStorageResults = (nodeResults: NodeResults) =>
  groupByKey(
    getTestingResults(nodeResults).filter(
      (result) => result.hardware_type === HardwareType.Storage
    ),
    "physical_blockdevice"
  );

const getOtherResults = (nodeResults: NodeResults) =>
  groupByKey(
    getTestingResults(nodeResults).filter(
      (result) => result.hardware_type === HardwareType.Node
    ),
    "hardware_type"
  );

const MachineTests = (): JSX.Element => {
  const dispatch = useDispatch();
  const params = useParams<RouteParams>();
  const { id } = params;

  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, id)
  );
  useWindowTitle(`${machine?.fqdn || "Machine"} tests`);

  const nodeResults = useSelector((state: RootState) =>
    nodeResultSelectors.get(state, id)
  );

  const loading = useSelector((state: RootState) =>
    nodeResultSelectors.loading(state)
  );

  useEffect(() => {
    if (!nodeResults && !loading) {
      dispatch(nodeResultActions.get(id));
    }
  }, [dispatch, nodeResults, loading, id]);

  if (nodeResults) {
    const allResults = getHardwareResults(nodeResults);
    const storageResults = getStorageResults(nodeResults);
    const otherResults = getOtherResults(nodeResults);

    return (
      <div>
        {Object.entries(allResults).map(
          ([hardware_type, nodeResults]: [string, NodeResult[]]) => {
            return (
              <div key={hardware_type}>
                <h4 data-test="hardware-heading">
                  {HardwareType[parseInt(hardware_type, 0)]}
                </h4>
                <MachineTestsTable nodeResults={nodeResults} />
              </div>
            );
          }
        )}
        {Object.keys(storageResults).length !== 0 ? (
          <>
            <h4 data-test="hardware-heading">Storage</h4>
            {Object.entries(storageResults).map(
              ([physical_blockdevice, nodeResults]: [string, NodeResult[]]) => {
                return (
                  <div key={physical_blockdevice}>
                    <h5 data-test="storage-heading">{physical_blockdevice}</h5>
                    <MachineTestsTable nodeResults={nodeResults} />
                  </div>
                );
              }
            )}
          </>
        ) : null}
        {Object.keys(otherResults).length !== 0 ? (
          <>
            <h4 data-test="hardware-heading">Other Results</h4>
            {Object.entries(otherResults).map(
              ([hardware_type, nodeResults]: [string, NodeResult[]]) => {
                return (
                  <div key={hardware_type}>
                    <MachineTestsTable nodeResults={nodeResults} />
                  </div>
                );
              }
            )}
          </>
        ) : null}
      </div>
    );
  }
  return <Spinner text="Loading..." />;
};

export default MachineTests;
