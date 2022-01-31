import {
  Button,
  Strip,
  Notification,
  Row,
  Col,
  ActionButton,
} from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

import VisuallyHidden from "app/base/components/VisuallyHidden";
import { useCycled } from "app/base/hooks";
import { useId } from "app/base/hooks/base";
import { actions as subnetActions } from "app/store/subnet";
import { default as subnetSelectors } from "app/store/subnet/selectors";
import { getCanBeDeleted, getIsDHCPEnabled } from "app/store/subnet/utils";
import { default as vlanSelectors } from "app/store/vlan/selectors";
import urls from "app/subnets/urls";
import type { SubnetActionProps } from "app/subnets/views/SubnetDetails/types";
import { formatErrors } from "app/utils";

export const DeleteSubnet = ({
  setActiveForm,
}: Omit<SubnetActionProps, "activeForm">): JSX.Element | null => {
  const subnet = useSelector(subnetSelectors.active);
  const vlans = useSelector(vlanSelectors.all);
  const canBeDeleted = subnet ? getCanBeDeleted(vlans, subnet) : false;
  const dispatch = useDispatch();
  const history = useHistory();
  const errors = useSelector(subnetSelectors.errors);
  const saving = useSelector(subnetSelectors.saving);
  const saved = useSelector(subnetSelectors.saved);
  const errorMessage = formatErrors(errors);
  const dhcpEnabled = getIsDHCPEnabled(vlans, subnet);
  const sectionId = useId();

  const handleClose = () => setActiveForm(null);

  const handleDelete = () => {
    if (subnet) {
      dispatch(subnetActions.delete(subnet.id));
    }
  };

  useCycled(saved, () => {
    if (saved) {
      history.replace(urls.index);
    }
  });

  return (
    <Strip shallow element="section" aria-labelledby={sectionId}>
      <VisuallyHidden>
        <h2 id={sectionId}>Delete subnet</h2>
      </VisuallyHidden>

      {errors ? (
        <Notification inline severity="negative" title="Error:">
          {errorMessage}
        </Notification>
      ) : null}

      {!canBeDeleted ? (
        <Row>
          <Col size={8}>
            <Notification
              inline
              severity="negative"
              title="Error:"
              onDismiss={handleClose}
            >
              This subnet cannot be deleted as there are nodes that have an IP
              address obtained through DHCP services on this subnet. Release
              these nodes in order to proceed.
            </Notification>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col size={8}>
            <p>
              Are you sure you want to remove subnet {subnet?.name}?
              {dhcpEnabled ? null : (
                <p>
                  Beware IP addresses on devices on this subnet might not be
                  retained.
                </p>
              )}
            </p>
          </Col>
          <Col size={4} className="u-align--right">
            <ActionButton
              appearance="negative"
              onClick={handleDelete}
              disabled={saving}
            >
              Yes, delete subnet
            </ActionButton>
            <Button onClick={handleClose} disabled={saving}>
              No, cancel
            </Button>
          </Col>
        </Row>
      )}
    </Strip>
  );
};

export default DeleteSubnet;
