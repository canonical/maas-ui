import { Button } from "@canonical/react-components";

import MachinesHeader from "app/base/components/node/MachinesHeader";
import TagHeaderForms from "app/tags/components/TagsHeader/TagHeaderForms";
import { TagHeaderViews } from "app/tags/constants";
import type { TagHeaderContent, TagSetHeaderContent } from "app/tags/types";

type Props = {
  headerContent: TagHeaderContent | null;
  setHeaderContent: TagSetHeaderContent;
};

export const getHeaderTitle = (
  headerContent: TagHeaderContent | null
): string => {
  if (headerContent) {
    const [, name] = headerContent.view;
    switch (name) {
      case TagHeaderViews.AddTag[1]:
        return "Create new tag";
    }
  }
  return "Machines";
};

export const TagsHeader = ({
  headerContent,
  setHeaderContent,
}: Props): JSX.Element => {
  return (
    <MachinesHeader
      buttons={[
        <Button
          appearance="positive"
          onClick={() => setHeaderContent({ view: TagHeaderViews.AddTag })}
        >
          Create new tag
        </Button>,
      ]}
      headerContent={
        headerContent && (
          <TagHeaderForms
            headerContent={headerContent}
            setHeaderContent={setHeaderContent}
          />
        )
      }
      title={getHeaderTitle(headerContent)}
    />
  );
};

export default TagsHeader;
