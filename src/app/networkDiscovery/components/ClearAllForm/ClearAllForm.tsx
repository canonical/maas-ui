import { useCallback } from "react";

import { ExternalLink } from "@canonical/maas-react-components";
import {
  Notification,
  NotificationSeverity,
} from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import FormikForm from "@/app/base/components/FormikForm";
import docsUrls from "@/app/base/docsUrls";
import type { EmptyObject } from "@/app/base/types";
import configSelectors from "@/app/store/config/selectors";
import { NetworkDiscovery } from "@/app/store/config/types";
import { discoveryActions } from "@/app/store/discovery";
import discoverySelectors from "@/app/store/discovery/selectors";
import { messageActions } from "@/app/store/message";

export enum Labels {
  SubmitLabel = "Clear all discoveries",
}

type Props = {
  closeForm: () => void;
};

const ClearAllForm = ({ closeForm }: Props): React.ReactElement => {
  const dispatch = useDispatch();
  const errors = useSelector(discoverySelectors.errors);
  const saved = useSelector(discoverySelectors.saved);
  const saving = useSelector(discoverySelectors.saving);
  const networkDiscovery = useSelector(configSelectors.networkDiscovery);
  const cleanup = useCallback(() => discoveryActions.cleanup(), []);
  let content: React.ReactElement;
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
          <ExternalLink to={docsUrls.networkDiscovery}>
            network discovery
          </ExternalLink>
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
    <FormikForm<EmptyObject>
      aria-label="Clear all discoveries"
      cleanup={cleanup}
      errors={errors}
      initialValues={{}}
      onCancel={closeForm}
      onSaveAnalytics={{
        action: "Network discovery",
        category: "Clear network discoveries",
        label: "Clear network discoveries button",
      }}
      onSubmit={() => {
        dispatch(cleanup());
        dispatch(discoveryActions.clear());
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
      saved={saved}
      saving={saving}
      secondarySubmitLabel="Save and add another"
      submitLabel={Labels.SubmitLabel}
    >
      <Notification severity={NotificationSeverity.CAUTION} title="Warning:">
        Clearing all discoveries will remove all items from the list below.
      </Notification>
      {content}
    </FormikForm>
  );
};

export default ClearAllForm;
