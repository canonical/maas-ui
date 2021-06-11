import type { ReactNode } from "react";

import {
  ActionButton,
  Button,
  Col,
  // Notification,
  Row,
} from "@canonical/react-components";
import type { Props as ButtonProps } from "@canonical/react-components/dist/components/Button/Button";

// import { useMachineDetailsForm } from "app/machines/hooks";
// import type { Machine, MachineStatus } from "app/store/machine/types";
// import { formatErrors } from "app/utils";

type Props = {
  confirmLabel: string;
  eventName?: string;
  message?: ReactNode;
  closeExpanded: () => void;
  onConfirm: () => void;
  submitAppearance?: ButtonProps["appearance"];
};

const DeleteConfirm = ({
  closeExpanded,
  confirmLabel,
  // eventName,
  message,
  onConfirm,
  submitAppearance = "negative",
}: Props): JSX.Element => {
  // const { errors, saved, saving } = useMachineDetailsForm(
  //   systemId,
  //   statusKey,
  //   eventName,
  //   () => closeExpanded()
  // );
  // const formattedErrors = formatErrors(errors);

  return (
    <Row>
      {/* {formattedErrors ? (
        <Notification type="negative">
          <span data-test="error-message">{formattedErrors}</span>
        </Notification>
      ) : null} */}
      <Col size={8}>
        {message && (
          <p className="u-no-margin--bottom u-no-max-width">
            <i className="p-icon--error is-inline">Warning</i>
            {message}
          </p>
        )}
      </Col>
      <Col size={4} className="u-align--right">
        <Button onClick={closeExpanded}>Cancel</Button>
        <ActionButton
          appearance={submitAppearance}
          // loading={saving}
          onClick={onConfirm}
        >
          {confirmLabel}
        </ActionButton>
      </Col>
    </Row>
  );
};

export default DeleteConfirm;
