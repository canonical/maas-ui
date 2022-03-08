import { Button } from "@canonical/react-components";

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
      // TODO Implement the add tag form:
      // https://github.com/canonical-web-and-design/app-tribe/issues/690
      return (
        <>
          Add tag form{" "}
          <Button onClick={() => setHeaderContent(null)}>Close</Button>
        </>
      );
    default:
      return null;
  }
};

export default TagHeaderForms;
