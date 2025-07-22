import { ExternalLink } from "@canonical/maas-react-components";
import {
  Notification,
  NotificationSeverity,
} from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import { useClearNetworkDiscoveries } from "@/app/api/query/networkDiscovery";
import ModelActionForm from "@/app/base/components/ModelActionForm";
import docsUrls from "@/app/base/docsUrls";
import configSelectors from "@/app/store/config/selectors";
import { NetworkDiscovery } from "@/app/store/config/types";
import { messageActions } from "@/app/store/message";

export enum Labels {
  SubmitLabel = "Clear all discoveries",
}

type Props = {
  closeForm: () => void;
};

const ClearAllForm = ({ closeForm }: Props): React.ReactElement => {
  const dispatch = useDispatch();
  const networkDiscovery = useSelector(configSelectors.networkDiscovery);
  const clearDiscovery = useClearNetworkDiscoveries();
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
    <ModelActionForm
      aria-label="Clear all discoveries"
      errors={clearDiscovery.error}
      initialValues={{}}
      modelType="discovery"
      onCancel={closeForm}
      onSaveAnalytics={{
        action: "Network discovery",
        category: "Clear network discoveries",
        label: "Clear network discoveries button",
      }}
      onSubmit={() => {
        clearDiscovery.mutate({});
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
      saved={clearDiscovery.isSuccess}
      saving={clearDiscovery.isPending}
      secondarySubmitLabel="Save and add another"
      submitLabel={Labels.SubmitLabel}
    >
      <Notification severity={NotificationSeverity.CAUTION} title="Warning:">
        Clearing all discoveries will remove all items from the list below.
      </Notification>
      {content}
    </ModelActionForm>
  );
};

export default ClearAllForm;
