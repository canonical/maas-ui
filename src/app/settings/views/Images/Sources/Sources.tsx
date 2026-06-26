import type { ReactElement } from "react";

import {
  ContentSection,
  MainToolbar,
  useSidePanel,
} from "@canonical/maas-react-components";
import { Button } from "@canonical/react-components";

import { Entitlement } from "../../UserManagement/views/Groups/constants";

import type { BootSourceResponse } from "@/app/apiclient";
import PageContent from "@/app/base/components/PageContent";
import { useHasEntitlements } from "@/app/base/hooks";
import type { BootResourceSourceType } from "@/app/images/types";
import AddSource from "@/app/settings/views/Images/Sources/components/AddSource";
import SourcesTable from "@/app/settings/views/Images/Sources/components/SourcesTable";

export type ImageSource = BootSourceResponse & {
  type: BootResourceSourceType;
};

const Sources = (): ReactElement => {
  const { openSidePanel } = useSidePanel();
  const canEdit = useHasEntitlements([Entitlement.CAN_EDIT_BOOT_ENTITIES]);

  return (
    <PageContent>
      <ContentSection variant="wide">
        <ContentSection.Header>
          <MainToolbar>
            <MainToolbar.Title>Sources</MainToolbar.Title>
            <MainToolbar.Controls>
              <Button
                disabled={!canEdit}
                onClick={() => {
                  openSidePanel({
                    component: AddSource,
                    title: "Add custom source",
                  });
                }}
              >
                Add custom source
              </Button>
            </MainToolbar.Controls>
          </MainToolbar>
        </ContentSection.Header>
        <ContentSection.Content>
          <SourcesTable canEdit={canEdit} />
        </ContentSection.Content>
      </ContentSection>
    </PageContent>
  );
};

export default Sources;
