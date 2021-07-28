import type { ReactNode } from "react";

import { ActionButton, Button, Col, Row } from "@canonical/react-components";
import type { ActionButtonProps } from "@canonical/react-components";

type Props = {
  confirmLabel: string;
  eventName?: string;
  message?: ReactNode;
  closeExpanded: () => void;
  onConfirm: () => void;
  submitAppearance?: ActionButtonProps["appearance"];
};

const DeleteConfirm = ({
  closeExpanded,
  confirmLabel,
  message,
  onConfirm,
  submitAppearance = "negative",
}: Props): JSX.Element => {
  return (
    <Row>
      <Col size={8}>
        {message && (
          <p className="u-no-margin--bottom u-no-max-width">
            <i className="p-icon--error is-inline">Warning</i>
            {message}
          </p>
        )}
      </Col>
      <Col size={4} className="u-align--right">
        <Button data-test="close-confirm-delete" onClick={closeExpanded}>
          Cancel
        </Button>
        <ActionButton
          data-test="delete-az"
          appearance={submitAppearance}
          onClick={onConfirm}
        >
          {confirmLabel}
        </ActionButton>
      </Col>
    </Row>
  );
};

export default DeleteConfirm;
