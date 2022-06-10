import { Button, Col, Icon, Row, Strip } from "@canonical/react-components";

import { MachineHeaderViews } from "app/machines/constants";
import type { MachineSetHeaderContent } from "app/machines/types";
import type { ControllerDetails } from "app/store/controller/types";
import type { MachineDetails } from "app/store/machine/types";
import { NodeDeviceBus } from "app/store/nodedevice/types";
import type { NodeDevice } from "app/store/nodedevice/types";
import { NodeActions, NodeStatusCode } from "app/store/types/node";
import { nodeIsMachine } from "app/store/utils";

type Props = {
  bus: NodeDeviceBus;
  node: ControllerDetails | MachineDetails;
  nodeDevices: NodeDevice[];
  setHeaderContent?: MachineSetHeaderContent;
};

const NodeDevicesWarning = ({
  bus,
  node,
  nodeDevices,
  setHeaderContent,
}: Props): JSX.Element | null => {
  const isMachine = nodeIsMachine(node);
  const busDisplay = bus === NodeDeviceBus.PCIE ? "PCI" : "USB";
  const canBeCommissioned =
    isMachine && node.actions.includes(NodeActions.COMMISSION);
  const noDevices = nodeDevices.length === 0;
  const noUSB = !nodeDevices.some((device) => device.bus === NodeDeviceBus.USB);

  let warning: React.ReactNode;
  if (noDevices) {
    let warningMessage = "";
    if (canBeCommissioned) {
      warningMessage =
        "Try commissioning this machine to load PCI and USB device information.";
    } else if (isMachine) {
      if (node.locked) {
        warningMessage =
          "The machine is locked. Unlock and release this machine before commissioning to load PCI and USB device information.";
      } else if (node.status_code === NodeStatusCode.FAILED_TESTING) {
        warningMessage =
          "Override failed testing before commissioning to load PCI and USB device information.";
      } else if (node.status_code === NodeStatusCode.DEPLOYED) {
        warningMessage =
          "Release this machine before commissioning to load PCI and USB device information.";
      } else if (node.status_code === NodeStatusCode.COMMISSIONING) {
        warningMessage = "Commissioning is currently in progress...";
      } else {
        warningMessage = "Commissioning cannot be run at this time.";
      }
    }
    warning = (
      <>
        <h4>No {busDisplay} information</h4>
        {warningMessage && (
          <p className="u-sv1" data-testid="no-devices-warning">
            {warningMessage}
          </p>
        )}
        {canBeCommissioned && setHeaderContent && (
          <Button
            appearance="positive"
            data-testid="commission-machine"
            onClick={() =>
              setHeaderContent({ view: MachineHeaderViews.COMMISSION_MACHINE })
            }
          >
            Commission
          </Button>
        )}
      </>
    );
  } else if (bus === NodeDeviceBus.USB && noUSB) {
    warning = (
      <>
        <h4>No USB information</h4>
        {isMachine && (
          <p className="u-sv1" data-testid="no-usb-warning">
            No USB devices discovered during commissioning.
          </p>
        )}
      </>
    );
  }
  return warning ? (
    <Strip data-testid="node-devices-warning" shallow>
      <Row>
        <Col className="u-flex" emptyLarge={4} size={6}>
          <h4>
            <Icon name="warning" />
          </h4>
          <div className="u-flex--grow u-nudge-right">{warning}</div>
        </Col>
      </Row>
    </Strip>
  ) : null;
};

export default NodeDevicesWarning;
