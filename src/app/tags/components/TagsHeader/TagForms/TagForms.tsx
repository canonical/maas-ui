import AddTagForm from "../AddTagForm";
import DeleteTagForm from "../DeleteTagForm";

import type { SidePanelContentTypes } from "@/app/base/side-panel-context";
import { TagSidePanelViews } from "@/app/tags/constants";
import TagUpdate from "@/app/tags/views/TagUpdate";

type Props = SidePanelContentTypes;

export const TagForms = ({
  sidePanelContent,
  setSidePanelContent,
}: Props): React.ReactElement | null => {
  const id =
    sidePanelContent?.extras && "id" in sidePanelContent?.extras
      ? sidePanelContent.extras.id
      : null;
  const fromDetails =
    sidePanelContent?.extras && "fromDetails" in sidePanelContent?.extras
      ? sidePanelContent.extras.fromDetails
      : undefined;

  switch (sidePanelContent?.view) {
    case TagSidePanelViews.AddTag:
      return (
        <AddTagForm
          onClose={() => {
            setSidePanelContent(null);
          }}
        />
      );
    case TagSidePanelViews.DeleteTag: {
      if (id) {
        return (
          <DeleteTagForm
            fromDetails={fromDetails}
            id={id}
            // Set a key so that if a different tag is click on while the form
            // is open then it renders the form again and scrolls to the top.
            key={id}
            onClose={() => {
              setSidePanelContent(null);
            }}
          />
        );
      }
      return null;
    }
    case TagSidePanelViews.UpdateTag: {
      if (!id) return null;
      return (
        <TagUpdate
          id={id}
          onClose={() => {
            setSidePanelContent(null);
          }}
        />
      );
    }
    default:
      return null;
  }
};

export default TagForms;
