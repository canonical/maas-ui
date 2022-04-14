import { useCallback } from "react";

import { Notification, Spinner, Strip } from "@canonical/react-components";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import FormikFormContent from "app/base/components/FormikFormContent";
import { useCycled } from "app/base/hooks";
import type { EmptyObject } from "app/base/types";
import dashboardURLs from "app/dashboard/urls";
import type { RootState } from "app/store/root/types";
import { actions as subnetActions } from "app/store/subnet";
import subnetSelectors from "app/store/subnet/selectors";
import type { SubnetActionProps } from "app/subnets/views/SubnetDetails/types";

export const MapSubnet = ({
  id,
  setActiveForm,
}: Omit<SubnetActionProps, "activeForm">): JSX.Element | null => {
  const dispatch = useDispatch();
  const cleanup = useCallback(() => subnetActions.cleanup(), []);
  const subnet = useSelector((state: RootState) =>
    subnetSelectors.getById(state, id)
  );
  const scanError = useSelector((state: RootState) =>
    subnetSelectors.eventErrorsForSubnets(state, id, "scan")
  )[0]?.error;
  const scanning = useSelector((state: RootState) =>
    subnetSelectors.getStatusForSubnet(state, id, "scanning")
  );
  const [scanned, resetScanned] = useCycled(!scanning);
  const saved = scanned && !scanError;

  if (!subnet) {
    return (
      <Strip data-testid="loading-subnet" shallow>
        <Spinner text="Loading..." />
      </Strip>
    );
  }

  const closeForm = () => setActiveForm(null);
  const isIPv4 = subnet.version === 4;
  return (
    <Formik
      initialValues={{}}
      onSubmit={() => {
        resetScanned();
        dispatch(cleanup());
        dispatch(subnetActions.scan(id));
      }}
    >
      <FormikFormContent<EmptyObject>
        buttonsBordered={false}
        cleanup={cleanup}
        errors={scanError}
        onCancel={closeForm}
        onSuccess={closeForm}
        saved={saved}
        saving={scanning}
        submitDisabled={!isIPv4}
        submitLabel="Map subnet"
      >
        {isIPv4 ? (
          <>
            You will start mapping your subnet. Go to the{" "}
            <Link to={dashboardURLs.index}>dashboard</Link> to see the
            discovered items.
          </>
        ) : (
          <Notification borderless inline severity="negative" title="Error:">
            Only IPv4 subnets can be scanned.
          </Notification>
        )}
      </FormikFormContent>
    </Formik>
  );
};

export default MapSubnet;
