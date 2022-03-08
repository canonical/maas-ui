import { Button } from "@canonical/react-components";

import MachinesHeader from "app/base/components/node/MachinesHeader";
import TagHeaderForms from "app/pools/components/TagHeaderForms";
import { TagHeaderViews } from "app/tags/constants";
import type { TagHeaderContent, TagSetHeaderContent } from "app/tags/types";

type Props = {
  headerContent: TagHeaderContent | null;
  setHeaderContent: TagSetHeaderContent;
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
    />
  );
};

export default TagsHeader;
