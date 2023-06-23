import AddTagForm from "../AddTagForm";
import DeleteTagForm from "../DeleteTagForm";

import type { SidePanelContent } from "app/base/side-panel-context";
import { TagSidePanelViews } from "app/tags/constants";
import type {
  TagSetSidePanelContent,
  TagSidePanelContent,
} from "app/tags/types";

type Props = {
  sidePanelContent: SidePanelContent;
  setSidePanelContent: TagSetSidePanelContent;
};

export const TagForms = ({
  sidePanelContent,
  setSidePanelContent,
}: Props): JSX.Element | null => {
  switch (sidePanelContent?.view) {
    case TagSidePanelViews.AddTag:
      return <AddTagForm onClose={() => setSidePanelContent(null)} />;
    case TagSidePanelViews.DeleteTag:
      const id = (sidePanelContent as TagSidePanelContent)?.extras?.id;
      if (id) {
        return (
          <DeleteTagForm
            fromDetails={
              (sidePanelContent as TagSidePanelContent)?.extras?.fromDetails
            }
            id={id}
            // Set a key so that if a different tag is click on while the form
            // is open then it renders the form again and scrolls to the top.
            key={id}
            onClose={() => setSidePanelContent(null)}
          />
        );
      }
      return null;
    default:
      return null;
  }
};

export default TagForms;
