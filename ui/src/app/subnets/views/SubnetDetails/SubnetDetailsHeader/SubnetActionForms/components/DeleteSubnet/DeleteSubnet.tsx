import type { ReactNode } from "react";
import { useEffect } from "react";

import { Col, Notification, Row } from "@canonical/react-components";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";

import FormikFormContent from "app/base/components/FormikFormContent";
import TitledSection from "app/base/components/TitledSection";
import type { EmptyObject } from "app/base/types";
import { actions as subnetActions } from "app/store/subnet";
import { useCanBeDeleted, useIsDHCPEnabled } from "app/store/subnet/hooks";
import subnetSelectors from "app/store/subnet/selectors";
import subnetURLs from "app/subnets/urls";
import type { SubnetActionProps } from "app/subnets/views/SubnetDetails/types";

export const DeleteSubnet = ({
  id,
  setActiveForm,
}: Omit<SubnetActionProps, "activeForm">): JSX.Element | null => {
  const dispatch = useDispatch();
  const errors = useSelector(subnetSelectors.errors);
  const saving = useSelector(subnetSelectors.saving);
  const saved = useSelector(subnetSelectors.saved);
  const handleClose = () => setActiveForm(null);
  const canBeDeleted = useCanBeDeleted(id);
  const dhcpEnabled = useIsDHCPEnabled(id);

  useEffect(() => {
    dispatch(subnetActions.fetch());
  }, [dispatch]);

  let message: ReactNode;

  if (canBeDeleted) {
    message = (
      <>
        <p>Are you sure you want to delete this subnet?</p>
        {dhcpEnabled ? null : (
          <p>
            Beware IP addresses on devices on this subnet might not be retained.
          </p>
        )}
      </>
    );
  } else {
    message = (
      <Notification inline severity="negative" title="Error:">
        This subnet cannot be deleted as there are nodes that have an IP address
        obtained through DHCP services on this subnet. Release these nodes in
        order to proceed.
      </Notification>
    );
  }

  return (
    <TitledSection title="Delete subnet?" headingVisuallyHidden>
      <Row>
        <Col size={8}>{message}</Col>
      </Row>
      <Formik
        initialValues={{}}
        onSubmit={() => {
          dispatch(subnetActions.delete(id));
        }}
      >
        <FormikFormContent<EmptyObject>
          aria-label="Delete subnet"
          buttonsBordered={false}
          cleanup={subnetActions.cleanup}
          errors={errors}
          onCancel={handleClose}
          savedRedirect={subnetURLs.index}
          saved={saved}
          saving={saving}
          submitAppearance="negative"
          submitDisabled={!canBeDeleted}
          submitLabel="Delete"
        />
      </Formik>
    </TitledSection>
  );
};

export default DeleteSubnet;
