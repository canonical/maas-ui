import React, { useEffect } from "react";

import { ActionButton, Button, Col, Row } from "@canonical/react-components";
import { usePrevious } from "@canonical/react-components/dist/hooks";
import { useSelector } from "react-redux";

import { useSendAnalyticsWhen } from "app/base/hooks";
import type { AnalyticsEvent } from "app/base/types";
import machineSelectors from "app/store/machine/selectors";
import type { Machine, MachineStatus } from "app/store/machine/types";
import type { RootState } from "app/store/root/types";

type Props = {
  confirmLabel: string;
  message: string;
  closeExpanded: () => void;
  onConfirm: () => void;
  onSaveAnalytics: AnalyticsEvent;
  statusKey: keyof MachineStatus;
  systemId: Machine["system_id"];
};

const ActionConfirm = ({
  closeExpanded,
  confirmLabel,
  message,
  onConfirm,
  onSaveAnalytics,
  statusKey,
  systemId,
}: Props): JSX.Element => {
  const machineStatuses = useSelector((state: RootState) =>
    machineSelectors.getStatuses(state, systemId)
  );
  const saving = (machineStatuses && machineStatuses[statusKey]) || false;
  const previousSaving = usePrevious(saving);
  const saved = !saving && previousSaving;

  useSendAnalyticsWhen(
    saved,
    onSaveAnalytics.category,
    onSaveAnalytics.action,
    onSaveAnalytics.label
  );

  // Close the form when action has successfully completed.
  // TODO: Check for machine-specific error, in which case keep form open.
  // https://github.com/canonical-web-and-design/maas-ui/issues/1842
  useEffect(() => {
    if (saved) {
      closeExpanded();
    }
  }, [closeExpanded, saved]);

  return (
    <Row>
      <Col size={8}>
        <p className="u-no-margin--bottom u-no-max-width">
          <i className="p-icon--warning is-inline">Warning</i>
          {message}
        </p>
      </Col>
      <Col size={4} className="u-align--right">
        <Button className="u-no-margin--bottom" onClick={closeExpanded}>
          Cancel
        </Button>
        <ActionButton
          appearance="negative"
          className="u-no-margin--bottom"
          loading={saving}
          onClick={onConfirm}
        >
          {confirmLabel}
        </ActionButton>
      </Col>
    </Row>
  );
};

export default ActionConfirm;
