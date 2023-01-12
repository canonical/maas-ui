import { Button } from "@canonical/react-components";

import MachinesHeader from "app/base/components/node/MachinesHeader";
import { useFetchMachineCount } from "app/store/machine/utils/hooks";
import TagHeaderForms from "app/tags/components/TagsHeader/TagHeaderForms";
import { TagHeaderViews } from "app/tags/constants";
import type { TagHeaderContent, TagSetHeaderContent } from "app/tags/types";
import { TagViewState } from "app/tags/types";

export type Props = {
  headerContent: TagHeaderContent | null;
  setHeaderContent: TagSetHeaderContent;
  tagViewState?: TagViewState | null;
};

export enum Label {
  CreateButton = "Create new tag",
  Header = "Tags header",
}

export const getHeaderTitle = (
  headerContent: TagHeaderContent | null
): string => {
  if (headerContent) {
    const [, name] = headerContent.view;
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
  headerContent,
  setHeaderContent,
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
                  setHeaderContent({ view: TagHeaderViews.AddTag })
                }
              >
                {Label.CreateButton}
              </Button>,
            ]
      }
      headerContent={
        headerContent && (
          <TagHeaderForms
            headerContent={headerContent}
            setHeaderContent={setHeaderContent}
          />
        )
      }
      machineCount={machineCount}
      sidePanelTitle={getHeaderTitle(headerContent)}
      title="Machines"
    />
  );
};

export default TagsHeader;
