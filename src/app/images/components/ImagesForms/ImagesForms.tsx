import { useCallback } from "react";

import DeleteImageConfirm from "../ImagesTable/DeleteImageConfirm";

import type { SidePanelContentTypes } from "app/base/side-panel-context";
import { ImageSidePanelViews } from "app/images/constants";
import ChangeSource from "app/images/views/ImageList/SyncedImages/ChangeSource";

type Props = SidePanelContentTypes & {};

const ImagesForms = ({
  sidePanelContent,
  setSidePanelContent,
}: Props): JSX.Element | null => {
  const clearSidePanelContent = useCallback(
    () => setSidePanelContent(null),
    [setSidePanelContent]
  );

  if (!sidePanelContent) {
    return null;
  }

  const hasSources =
    sidePanelContent.extras && "hasSources" in sidePanelContent.extras
      ? sidePanelContent.extras.hasSources
      : false;

  switch (sidePanelContent.view) {
    case ImageSidePanelViews.CHANGE_SOURCE:
      return (
        <ChangeSource
          closeForm={hasSources ? () => clearSidePanelContent() : null}
          inCard={false}
        />
      );
    case ImageSidePanelViews.DELETE_IMAGE: {
      const bootResource =
        sidePanelContent.extras && "bootResource" in sidePanelContent.extras
          ? sidePanelContent.extras.bootResource
          : null;
      if (!bootResource) return null;
      return (
        <DeleteImageConfirm
          closeForm={clearSidePanelContent}
          resource={bootResource}
        />
      );
    }
    default:
      return null;
  }
};

export default ImagesForms;
