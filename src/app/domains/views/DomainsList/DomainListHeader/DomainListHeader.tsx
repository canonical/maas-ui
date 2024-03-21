import { MainToolbar } from "@canonical/maas-react-components";
import { Button, Spinner } from "@canonical/react-components";
import { useSelector } from "react-redux";

import { DomainListSidePanelViews } from "../constants";

import ModelListSubtitle from "@/app/base/components/ModelListSubtitle";
import { useFetchActions } from "@/app/base/hooks";
import type { SetSidePanelContent } from "@/app/base/side-panel-context";
import { domainActions } from "@/app/store/domain";
import domainSelectors from "@/app/store/domain/selectors";

export enum Labels {
  AddDomains = "Add domains",
}

const DomainListHeader = ({
  setSidePanelContent,
}: {
  setSidePanelContent: SetSidePanelContent;
}): JSX.Element => {
  const domainCount = useSelector(domainSelectors.count);
  const domainsLoaded = useSelector(domainSelectors.loaded);

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
          key="add-domain"
          onClick={() =>
            setSidePanelContent({ view: DomainListSidePanelViews.ADD_DOMAIN })
          }
        >
          {Labels.AddDomains}
        </Button>
      </MainToolbar.Controls>
    </MainToolbar>
  );
};

export default DomainListHeader;
