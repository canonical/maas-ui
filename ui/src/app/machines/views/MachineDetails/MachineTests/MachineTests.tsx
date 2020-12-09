import { useEffect } from "react";

//import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

//import MachineTestsTable from "./MachineTestsTable";

//import { HardwareType } from "app/base/enum";
import { useWindowTitle } from "app/base/hooks";
import type { RouteParams } from "app/base/types";
import machineSelectors from "app/store/machine/selectors";
import type { RootState } from "app/store/root/types";
import { actions as scriptResultActions } from "app/store/scriptresult";
import scriptResultSelectors from "app/store/scriptresult/selectors";
//import type { NodeResult } from "app/store/noderesult/types";

/**
 * Group items by key
 * @param results a node results list
 * @param key
 */
/*
const groupByKey = <I,>(items: I[], key: keyof I): { [x: string]: I[] } =>
  items.reduce((obj, item) => {
    obj[item[key]] = obj[item[key]] || [];
    obj[item[key]].push(item);
    return obj;
  }, Object.create(null));
*/

const MachineTests = (): JSX.Element => {
  const dispatch = useDispatch();
  const params = useParams<RouteParams>();
  const { id } = params;

  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, id)
  );
  useWindowTitle(`${machine?.fqdn || "Machine"} tests`);

  const scriptResults = useSelector((state: RootState) =>
    scriptResultSelectors.getByMachineId(state, id)
  );

  /*
  const hardwareResults = useSelector((state: RootState) =>
    nodeResultSelectors.getHardwareTestingResults(state, id)
  );

  const storageResults = useSelector((state: RootState) =>
    nodeResultSelectors.getStorageTestingResults(state, id)
  );

  const otherResults = useSelector((state: RootState) =>
    nodeResultSelectors.getOtherTestingResults(state, id)
  );

  const loading = useSelector((state: RootState) =>
    nodeResultSelectors.loading(state)
  );
  */

  const loading = useSelector((state: RootState) =>
    scriptResultSelectors.loading(state)
  );

  useEffect(() => {
    if (!scriptResults.length && !loading) {
      dispatch(scriptResultActions.getByMachineId(id));
    }
  }, [dispatch, scriptResults, loading, id]);

  return (
    <ul>
      {scriptResults.map((scriptResult) => (
        <li>{scriptResult.name}</li>
      ))}
    </ul>
  );
  /*
  if (
    hardwareResults.length > 0 ||
    storageResults.length > 0 ||
    otherResults.length > 0
  ) {
    return (
      <div>
        {hardwareResults.length > 0
          ? Object.entries(groupByKey(hardwareResults, "hardware_type")).map(
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
            )
          : null}
        {storageResults.length > 0 ? (
          <>
            <h4 data-test="hardware-heading">Storage</h4>
            {Object.entries(
              groupByKey(storageResults, "physical_blockdevice")
            ).map(
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
        {otherResults.length > 0 ? (
          <>
            <h4 data-test="hardware-heading">Other Results</h4>
            {Object.entries(groupByKey(otherResults, "hardware_type")).map(
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
  */
};

export default MachineTests;
