import AddTagForm from "../AddTagForm";
import DeleteTagForm from "../DeleteTagForm";

import { TagHeaderViews } from "app/tags/constants";
import type { TagHeaderContent, TagSetHeaderContent } from "app/tags/types";

type Props = {
  headerContent: TagHeaderContent;
  setHeaderContent: TagSetHeaderContent;
};

export const TagHeaderForms = ({
  headerContent,
  setHeaderContent,
}: Props): JSX.Element | null => {
  switch (headerContent.view) {
    case TagHeaderViews.AddTag:
      return <AddTagForm onClose={() => setHeaderContent(null)} />;
    case TagHeaderViews.DeleteTag:
      const id = headerContent?.extras?.id;
      if (id) {
        return <DeleteTagForm id={id} onClose={() => setHeaderContent(null)} />;
      }
      return null;
    default:
      return null;
  }
};

export default TagHeaderForms;
