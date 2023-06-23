import { useCallback } from "react";

import type { ValueOf } from "@canonical/react-components";

import AddController from "./AddController";
import ControllerActionFormWrapper from "./ControllerActionFormWrapper";

import type { SidePanelContextType } from "app/base/side-panel-context";
import type { ControllerActionHeaderViews } from "app/controllers/constants";
import { ControllerSidePanelViews } from "app/controllers/constants";
import type { Controller } from "app/store/controller/types";

type Props = SidePanelContextType & {
  controllers: Controller[];
  viewingDetails?: boolean;
};

const ControllerForms = ({
  controllers,
  sidePanelContent,
  setSidePanelContent,
  viewingDetails = false,
}: Props): JSX.Element | null => {
  const clearSidePanelContent = useCallback(
    () => setSidePanelContent(null),
    [setSidePanelContent]
  );

  if (!sidePanelContent) {
    return null;
  }

  switch (sidePanelContent.view) {
    case ControllerSidePanelViews.ADD_CONTROLLER:
      return <AddController clearSidePanelContent={clearSidePanelContent} />;
    default:
      // We need to explicitly cast sidePanelContent.view here - TypeScript doesn't
      // seem to be able to infer remaining object tuple values as with string
      // values.
      // https://github.com/canonical/maas-ui/issues/3040
      const { view } = sidePanelContent as {
        view: ValueOf<typeof ControllerActionHeaderViews>;
      };
      const [, action] = view;
      return (
        <ControllerActionFormWrapper
          action={action}
          clearSidePanelContent={clearSidePanelContent}
          controllers={controllers}
          viewingDetails={viewingDetails}
        />
      );
  }
};

export default ControllerForms;
