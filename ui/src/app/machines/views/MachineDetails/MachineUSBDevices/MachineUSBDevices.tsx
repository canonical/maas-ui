import { Button, Col, Icon, Row, Strip } from "@canonical/react-components";
import { useSelector } from "react-redux";
import { useParams } from "react-router";

import type { SetSelectedAction } from "../MachineSummary";

import { useWindowTitle } from "app/base/hooks";
import type { RouteParams } from "app/base/types";
import machineSelectors from "app/store/machine/selectors";
import type { RootState } from "app/store/root/types";
import { NodeActions } from "app/store/types/node";

type Props = { setSelectedAction: SetSelectedAction };

const MachineUSBDevices = ({ setSelectedAction }: Props): JSX.Element => {
  const params = useParams<RouteParams>();
  const { id } = params;
  const machine = useSelector((state: RootState) =>
    machineSelectors.getById(state, id)
  );

  useWindowTitle(`${`${machine?.fqdn} ` || "Machine"} USB devices`);
  const informationAvailable = false; // TODO: Update when NodeDevice websocket api available
  const canBeCommissioned = machine?.actions.includes(NodeActions.COMMISSION);

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
            <th className="u-align--right">Bus address</th>
            <th className="u-align--right">Device address</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
      {!informationAvailable && (
        <Strip data-test="information-unavailable" shallow>
          <Row>
            <Col className="u-flex" emptyLarge={4} size={6}>
              <h4>
                <Icon name="warning" />
              </h4>
              <div className="u-flex--grow u-nudge-right">
                <h4>USB information not available</h4>
                <p className="u-sv1">
                  Try commissioning this machine to load USB information.
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

export default MachineUSBDevices;
