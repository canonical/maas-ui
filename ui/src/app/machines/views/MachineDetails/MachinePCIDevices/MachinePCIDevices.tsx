import { useEffect } from "react";

import { Button, Col, Icon, Row, Strip } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import type { SetSelectedAction } from "../MachineSummary";

import Placeholder from "app/base/components/Placeholder";
import { useWindowTitle } from "app/base/hooks";
import type { RouteParams } from "app/base/types";
import machineSelectors from "app/store/machine/selectors";
import { actions as nodeDeviceActions } from "app/store/nodedevice";
import nodeDeviceSelectors from "app/store/nodedevice/selectors";
import type { RootState } from "app/store/root/types";
import { NodeActions } from "app/store/types/node";

type Props = { setSelectedAction: SetSelectedAction };

const MachinePCIDevices = ({ setSelectedAction }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const params = useParams<RouteParams>();
  const { id } = params;
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, id)
  );
  const nodeDevicesLoading = useSelector(nodeDeviceSelectors.loading);

  useWindowTitle(`${`${machine?.fqdn} ` || "Machine"} PCI devices`);
  const canBeCommissioned = machine?.actions.includes(NodeActions.COMMISSION);

  useEffect(() => {
    dispatch(nodeDeviceActions.getByMachineId(id));
  }, [dispatch, id]);

  return (
    <>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>
              <div>Vendor</div>
              <div>ID</div>
            </th>
            <th>Product</th>
            <th>Product ID</th>
            <th>Driver</th>
            <th className="u-align--right">NUMA node</th>
            <th className="u-align--right">PCI address</th>
          </tr>
        </thead>
        <tbody>
          {nodeDevicesLoading ? (
            <>
              {Array.from(Array(5)).map((_, i) => (
                <tr key={`pci-placeholder-${i}`}>
                  <td>
                    <Placeholder>Group name</Placeholder>
                  </td>
                  <td>
                    <Placeholder>Example vendor description</Placeholder>
                  </td>
                  <td>
                    <Placeholder>Example product description</Placeholder>
                  </td>
                  <td>
                    <Placeholder>0000</Placeholder>
                  </td>
                  <td>
                    <Placeholder>Driver name</Placeholder>
                  </td>
                  <td className="u-align--right">
                    <Placeholder>0000</Placeholder>
                  </td>
                  <td className="u-align--right">
                    <Placeholder>0000:00:00.0</Placeholder>
                  </td>
                </tr>
              ))}
            </>
          ) : null}
        </tbody>
      </table>
      {!nodeDevicesLoading && (
        <Strip data-test="information-unavailable" shallow>
          <Row>
            <Col className="u-flex" emptyLarge={4} size={6}>
              <h4>
                <Icon name="warning" />
              </h4>
              <div className="u-flex--grow u-nudge-right">
                <h4>PCI information not available</h4>
                <p className="u-sv1">
                  Try commissioning this machine to load PCI information.
                </p>
                {canBeCommissioned && (
                  <Button
                    appearance="positive"
                    data-test="commission-machine"
                    onClick={() =>
                      setSelectedAction({ name: NodeActions.COMMISSION })
                    }
                  >
                    Commission
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        </Strip>
      )}
    </>
  );
};

export default MachinePCIDevices;
