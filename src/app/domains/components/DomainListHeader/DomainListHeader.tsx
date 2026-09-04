import { MainToolbar, useSidePanel } from "@canonical/maas-react-components";
import { Button, Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import DomainListHeaderForm from "./DomainListHeaderForm";

import ModelListSubtitle from "@/app/base/components/ModelListSubtitle";
import { useFetchActions, useHasEntitlements } from "@/app/base/hooks";
import { Entitlement } from "@/app/settings/views/UserManagement/views/Groups/constants";
import { domainActions } from "@/app/store/domain";
import domainSelectors from "@/app/store/domain/selectors";

export enum Labels {
  AddDomains = "Add domains",
}

const DomainListHeader = (): React.ReactElement => {
  const domainCount = useSelector(domainSelectors.count);
  const domainsLoaded = useSelector(domainSelectors.loaded);

  const { openSidePanel } = useSidePanel();
  const canEdit = useHasEntitlements([Entitlement.CAN_EDIT_GLOBAL_ENTITIES]);

  useFetchActions([domainActions.fetch]);

  return (
    <MainToolbar>
      <MainToolbar.Title>DNS</MainToolbar.Title>
      {domainsLoaded ? (
        <ModelListSubtitle available={domainCount} modelName="domain" />
      ) : (
        <Spinner text="Loading..." />
      )}
      <MainToolbar.Controls>
        <Button
          data-testid="add-domain"
          disabled={!canEdit}
          key="add-domain"
          onClick={() => {
            openSidePanel({
              component: DomainListHeaderForm,
              title: "Add domains",
            });
          }}
        >
          {Labels.AddDomains}
        </Button>
      </MainToolbar.Controls>
    </MainToolbar>
  );
};

export default DomainListHeader;
