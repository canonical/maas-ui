import { Button } from "@canonical/react-components";

import MachinesHeader from "app/base/components/node/MachinesHeader";
import type { SetSidePanelContent } from "app/base/side-panel-context";
import { useFetchMachineCount } from "app/store/machine/utils/hooks";
import { TagSidePanelViews } from "app/tags/constants";
import { TagViewState } from "app/tags/types";

export type Props = {
  setSidePanelContent: SetSidePanelContent;
  tagViewState?: TagViewState | null;
};

export enum Label {
  CreateButton = "Create new tag",
  Header = "Tags header",
}

export const TagsHeader = ({
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
                  setSidePanelContent({ view: TagSidePanelViews.AddTag })
                }
              >
                {Label.CreateButton}
              </Button>,
            ]
      }
      machineCount={machineCount}
      title="Tags"
    />
  );
};

export default TagsHeader;
