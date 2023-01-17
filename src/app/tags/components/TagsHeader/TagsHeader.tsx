import { Button } from "@canonical/react-components";

import MachinesHeader from "app/base/components/node/MachinesHeader";
import { useFetchMachineCount } from "app/store/machine/utils/hooks";
import TagHeaderForms from "app/tags/components/TagsHeader/TagHeaderForms";
import { TagHeaderViews } from "app/tags/constants";
import type { TagHeaderContent, TagSetSidePanelContent } from "app/tags/types";
import { TagViewState } from "app/tags/types";

export type Props = {
  sidePanelContent: TagHeaderContent | null;
  setSidePanelContent: TagSetSidePanelContent;
  tagViewState?: TagViewState | null;
};

export enum Label {
  CreateButton = "Create new tag",
  Header = "Tags header",
}

export const getHeaderTitle = (
  sidePanelContent: TagHeaderContent | null
): string => {
  if (sidePanelContent) {
    const [, name] = sidePanelContent.view;
    switch (name) {
      case TagHeaderViews.AddTag[1]:
        return "Create new tag";
      case TagHeaderViews.DeleteTag[1]:
        return "Delete tag";
    }
  }
  return "Machines";
};

export const TagsHeader = ({
  sidePanelContent,
  setSidePanelContent,
  tagViewState,
}: Props): JSX.Element => {
  const { machineCount } = useFetchMachineCount();
  return (
    <MachinesHeader
      aria-label={Label.Header}
      buttons={
        tagViewState === TagViewState.Updating
          ? null
          : [
              <Button
                appearance="positive"
                onClick={() =>
                  setSidePanelContent({ view: TagHeaderViews.AddTag })
                }
              >
                {Label.CreateButton}
              </Button>,
            ]
      }
      machineCount={machineCount}
      sidePanelContent={
        sidePanelContent && (
          <TagHeaderForms
            setSidePanelContent={setSidePanelContent}
            sidePanelContent={sidePanelContent}
          />
        )
      }
      sidePanelTitle={getHeaderTitle(sidePanelContent)}
      title="Machines"
    />
  );
};

export default TagsHeader;
