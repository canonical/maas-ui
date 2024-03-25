import { useCallback } from "react";

import { Notification, Spinner, Strip } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import FormikForm from "@/app/base/components/FormikForm";
import { useCycled } from "@/app/base/hooks";
import type { EmptyObject } from "@/app/base/types";
import urls from "@/app/base/urls";
import type { RootState } from "@/app/store/root/types";
import { subnetActions } from "@/app/store/subnet";
import subnetSelectors from "@/app/store/subnet/selectors";
import type { SubnetActionProps } from "@/app/subnets/views/SubnetDetails/types";

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
    <FormikForm<EmptyObject>
      cleanup={cleanup}
      errors={scanError}
      initialValues={{}}
      onCancel={closeForm}
      onSubmit={() => {
        resetScanned();
        dispatch(cleanup());
        dispatch(subnetActions.scan(id));
      }}
      onSuccess={closeForm}
      saved={saved}
      saving={scanning}
      submitDisabled={!isIPv4}
      submitLabel="Map subnet"
    >
      {isIPv4 ? (
        <>
          You will start mapping your subnet. Go to the{" "}
          <Link to={urls.networkDiscovery.index}>dashboard</Link> to see the
          discovered items.
        </>
      ) : (
        <Notification borderless inline severity="negative" title="Error:">
          Only IPv4 subnets can be scanned.
        </Notification>
      )}
    </FormikForm>
  );
};

export default MapSubnet;
