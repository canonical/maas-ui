import { useEffect } from "react";

import {
  ActionButton,
  Button,
  Col,
  Notification,
  Row,
} from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import { useCycled, useSendAnalyticsWhen } from "app/base/hooks";
import { actions as deviceActions } from "app/store/device";
import deviceSelectors from "app/store/device/selectors";
import type {
  Device,
  DeviceMeta,
  DeviceNetworkInterface,
} from "app/store/device/types";
import type { RootState } from "app/store/root/types";
import { formatErrors } from "app/utils";

type Props = {
  closeExpanded: () => void;
  nicId: DeviceNetworkInterface["id"];
  systemId: Device[DeviceMeta.PK];
};

const RemoveInterface = ({
  closeExpanded,
  nicId,
  systemId,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const deletingInterface = useSelector((state: RootState) =>
    deviceSelectors.getStatusForDevice(state, systemId, "deletingInterface")
  );
  const deleteInterfaceError = useSelector((state: RootState) =>
    deviceSelectors.eventErrorsForDevices(state, systemId, "deleteInterface")
  )[0]?.error;
  const [deletedInterface] = useCycled(
    !deletingInterface && !deleteInterfaceError
  );
  useSendAnalyticsWhen(
    deletedInterface,
    "Device network",
    "Remove interface",
    "Remove"
  );
  useEffect(() => {
    if (deletedInterface) {
      closeExpanded();
    }
  }, [closeExpanded, deletedInterface]);

  return (
    <Row>
      {deleteInterfaceError ? (
        <Notification severity="negative">
          <span data-testid="error-message">
            {formatErrors(deleteInterfaceError)}
          </span>
        </Notification>
      ) : null}
      <Col size={8}>
        <p className="u-no-margin--bottom u-no-max-width">
          <i className="p-icon--warning is-inline">Warning</i>
          Are you sure you want to remove this interface?
        </p>
      </Col>
      <Col className="u-align--right" size={4}>
        <Button className="u-no-margin--bottom" onClick={closeExpanded}>
          Cancel
        </Button>
        <ActionButton
          appearance="negative"
          className="u-no-margin--bottom"
          data-testid="confirm-delete"
          loading={deletingInterface}
          onClick={() => {
            dispatch(deviceActions.cleanup());
            dispatch(
              deviceActions.deleteInterface({
                interface_id: nicId,
                system_id: systemId,
              })
            );
          }}
          type="button"
        >
          Remove
        </ActionButton>
      </Col>
    </Row>
  );
};

export default RemoveInterface;
