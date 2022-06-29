import type { ReactNode } from "react";

import { ActionButton, Button, Col, Row } from "@canonical/react-components";
import type { ActionButtonProps } from "@canonical/react-components";

export enum Label {
  DeleteAZ = "Delete AZ",
}

type Props = {
  closeExpanded: () => void;
  confirmLabel: string;
  deleting: boolean;
  message?: ReactNode;
  onConfirm: () => void;
  submitAppearance?: ActionButtonProps["appearance"];
};

const DeleteConfirm = ({
  closeExpanded,
  confirmLabel,
  deleting,
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
      <Col className="u-align--right" size={4}>
        <Button data-testid="close-confirm-delete" onClick={closeExpanded}>
          Cancel
        </Button>
        <ActionButton
          appearance={submitAppearance}
          data-testid="delete-az"
          loading={deleting}
          onClick={onConfirm}
        >
          {confirmLabel}
        </ActionButton>
      </Col>
    </Row>
  );
};

export default DeleteConfirm;
