import AddTagForm from "../AddTagForm";
import DeleteTagForm from "../DeleteTagForm";

import { TagHeaderViews } from "app/tags/constants";
import type { TagHeaderContent, TagSetSidePanelContent } from "app/tags/types";

type Props = {
  sidePanelContent: TagHeaderContent;
  setSidePanelContent: TagSetSidePanelContent;
};

export const TagHeaderForms = ({
  sidePanelContent,
  setSidePanelContent,
}: Props): JSX.Element | null => {
  switch (sidePanelContent.view) {
    case TagHeaderViews.AddTag:
      return <AddTagForm onClose={() => setSidePanelContent(null)} />;
    case TagHeaderViews.DeleteTag:
      const id = sidePanelContent?.extras?.id;
      if (id) {
        return (
          <DeleteTagForm
            fromDetails={sidePanelContent?.extras?.fromDetails}
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

export default TagHeaderForms;
