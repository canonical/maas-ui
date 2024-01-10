import { MainToolbar } from "@canonical/maas-react-components";
import { Button } from "@canonical/react-components";

import type { SetSidePanelContent } from "app/base/side-panel-context";
import { TagSidePanelViews } from "app/tags/constants";
import { TagViewState } from "app/tags/types";

export type Props = {
  isDetails: boolean;
  setSidePanelContent: SetSidePanelContent;
  tagViewState?: TagViewState | null;
};

export enum Label {
  CreateButton = "Create new tag",
  Header = "Tags header",
}

export const TagsHeader = ({
  isDetails,
  setSidePanelContent,
  tagViewState,
}: Props): JSX.Element => {
  return (
    <MainToolbar>
      <MainToolbar.Title>Tags</MainToolbar.Title>
      <MainToolbar.Controls>
        {tagViewState === TagViewState.Updating ? null : (
          <>
            {isDetails ? null : null}
            <Button
              appearance="positive"
              onClick={() =>
                setSidePanelContent({ view: TagSidePanelViews.AddTag })
              }
            >
              {Label.CreateButton}
            </Button>
          </>
        )}
      </MainToolbar.Controls>
    </MainToolbar>
  );
};

export default TagsHeader;
