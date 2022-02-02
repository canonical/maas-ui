import { Notification, Row, Col } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import FormikForm from "app/base/components/FormikForm";
import TitledSection from "app/base/components/TitledSection";
import type { EmptyObject } from "app/base/types";
import { actions as subnetActions } from "app/store/subnet";
import { default as subnetSelectors } from "app/store/subnet/selectors";
import { getCanBeDeleted, getIsDHCPEnabled } from "app/store/subnet/utils";
import { default as vlanSelectors } from "app/store/vlan/selectors";
import urls from "app/subnets/urls";
import type { SubnetActionProps } from "app/subnets/views/SubnetDetails/types";

export const DeleteSubnet = ({
  id,
  setActiveForm,
}: Omit<SubnetActionProps, "activeForm">): JSX.Element | null => {
  const subnet = useSelector(subnetSelectors.active);
  const vlans = useSelector(vlanSelectors.all);
  const canBeDeleted = subnet ? getCanBeDeleted(vlans, subnet) : false;
  const dispatch = useDispatch();
  const errors = useSelector(subnetSelectors.errors);
  const saving = useSelector(subnetSelectors.saving);
  const saved = useSelector(subnetSelectors.saved);
  const dhcpEnabled = getIsDHCPEnabled(vlans, subnet);
  const handleClose = () => setActiveForm(null);

  return (
    <TitledSection title="Delete subnet?" headingVisuallyHidden>
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
            <p>Are you sure you want to delete subnet {subnet?.name}?</p>
            {dhcpEnabled ? null : (
              <p>
                Beware IP addresses on devices on this subnet might not be
                retained.
              </p>
            )}
          </Col>
          <Col size={4} className="u-align--right">
            <FormikForm<EmptyObject>
              buttonsBordered={false}
              cleanup={subnetActions.cleanup}
              errors={errors}
              initialValues={{}}
              onCancel={handleClose}
              onSubmit={() => {
                dispatch(subnetActions.delete(id));
              }}
              savedRedirect={urls.index}
              saved={saved}
              saving={saving}
              submitLabel="Yes, delete subnet"
              cancelLabel="No, cancel"
              submitAppearance="negative"
            />
          </Col>
        </Row>
      )}
    </TitledSection>
  );
};

export default DeleteSubnet;
