import { useCallback } from "react";

import {
  Link,
  Notification,
  NotificationSeverity,
} from "@canonical/react-components";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";

import FormikFormContent from "app/base/components/FormikFormContent";
import type { EmptyObject } from "app/base/types";
import configSelectors from "app/store/config/selectors";
import { NetworkDiscovery } from "app/store/config/types";
import { actions as discoveryActions } from "app/store/discovery";
import discoverySelectors from "app/store/discovery/selectors";
import { actions as messageActions } from "app/store/message";

type Props = {
  closeForm: () => void;
};

const ClearAllForm = ({ closeForm }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const errors = useSelector(discoverySelectors.errors);
  const saved = useSelector(discoverySelectors.saved);
  const saving = useSelector(discoverySelectors.saving);
  const networkDiscovery = useSelector(configSelectors.networkDiscovery);
  const cleanup = useCallback(() => discoveryActions.cleanup(), []);
  let content: JSX.Element;
  if (networkDiscovery === NetworkDiscovery.ENABLED) {
    content = (
      <>
        <p data-testid="enabled-message">
          MAAS will use passive techniques (such as listening to ARP requests
          and mDNS advertisements) to observe networks attached to rack
          controllers.
          <br />
          If active subnet mapping is enabled on the configured subnets, MAAS
          will actively scan them and ensure discovery information is accurate
          and complete.
        </p>
        <p>
          Learn more about{" "}
          <Link
            href="https://maas.io/docs/network-discovery"
            rel="noreferrer noopener"
            target="_blank"
          >
            network discovery
          </Link>
          .
        </p>
      </>
    );
  } else {
    content = (
      <p data-testid="disabled-message">
        Network discovery is disabled. The list of discovered items will not be
        repopulated.
      </p>
    );
  }
  return (
    <Formik
      initialValues={{}}
      onSubmit={() => {
        dispatch(cleanup());
        dispatch(discoveryActions.clear());
      }}
    >
      <FormikFormContent<EmptyObject>
        buttonsBordered={false}
        cleanup={cleanup}
        errors={errors}
        onCancel={closeForm}
        onSaveAnalytics={{
          action: "Network discovery",
          category: "Clear network discoveries",
          label: "Clear network discoveries button",
        }}
        onSuccess={() => {
          dispatch(
            messageActions.add(
              "All discoveries cleared.",
              NotificationSeverity.INFORMATION
            )
          );
          closeForm();
        }}
        saving={saving}
        saved={saved}
        submitLabel="Clear all discoveries"
        secondarySubmitLabel="Save and add another"
      >
        <Notification severity={NotificationSeverity.CAUTION} title="Warning:">
          Clearing all discoveries will remove all items from the list below.
        </Notification>
        {content}
      </FormikFormContent>
    </Formik>
  );
};

export default ClearAllForm;
