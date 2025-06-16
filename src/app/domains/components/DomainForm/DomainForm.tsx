import { useCallback } from "react";

import SetDefaultForm from "../SetDefaultForm";

import type { SidePanelContentTypes } from "@/app/base/side-panel-context";
import DomainListHeaderForm from "@/app/domains/views/DomainsList/DomainListHeaderForm";
import { DomainListSidePanelViews } from "@/app/domains/views/DomainsList/constants";
import { isId } from "@/app/utils";

type Props = SidePanelContentTypes & {};

const DomainForm = ({
  sidePanelContent,
  setSidePanelContent,
}: Props): React.ReactElement | null => {
  const clearSidePanelContent = useCallback(() => {
    setSidePanelContent(null);
  }, [setSidePanelContent]);

  if (!sidePanelContent) {
    return null;
  }

  switch (sidePanelContent.view) {
    case DomainListSidePanelViews.ADD_DOMAIN:
      return <DomainListHeaderForm closeForm={clearSidePanelContent} />;
    case DomainListSidePanelViews.SET_DEFAULT: {
      const id =
        sidePanelContent.extras && "id" in sidePanelContent.extras
          ? sidePanelContent.extras.id
          : null;
      if (!isId(id)) return null;
      return <SetDefaultForm id={id} onClose={clearSidePanelContent} />;
    }
    default:
      return null;
  }
};

export default DomainForm;
