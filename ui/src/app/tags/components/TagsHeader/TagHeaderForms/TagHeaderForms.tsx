import AddTagForm from "../AddTagForm";

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
    default:
      return null;
  }
};

export default TagHeaderForms;
