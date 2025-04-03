import { useCallback } from "react";

import DeleteImageForm from "./DeleteImageForm";

import type { SidePanelContentTypes } from "@/app/base/side-panel-context";
import DeleteMultipleImagesForm from "@/app/images/components/ImagesForms/DeleteMultipleImagesForm";
import SelectUpstreamImagesForm from "@/app/images/components/ImagesForms/SelectUpstreamImagesForm";
import { ImageSidePanelViews } from "@/app/images/constants";

type Props = SidePanelContentTypes & {};

const ImagesForms = ({ sidePanelContent, setSidePanelContent }: Props) => {
  const clearSidePanelContent = useCallback(() => {
    setSidePanelContent(null);
  }, [setSidePanelContent]);

  if (!sidePanelContent) {
    return null;
  }

  switch (sidePanelContent.view) {
    case ImageSidePanelViews.DELETE_IMAGE: {
      const bootResource =
        sidePanelContent.extras && "bootResource" in sidePanelContent.extras
          ? sidePanelContent.extras.bootResource
          : null;
      if (!bootResource) return null;
      return (
        <DeleteImageForm
          closeForm={clearSidePanelContent}
          resource={bootResource}
        />
      );
    }
    case ImageSidePanelViews.DELETE_MULTIPLE_IMAGES: {
      const rowSelection =
        sidePanelContent.extras && "rowSelection" in sidePanelContent.extras
          ? sidePanelContent.extras.rowSelection
          : null;
      const setRowSelection =
        sidePanelContent.extras && "setRowSelection" in sidePanelContent.extras
          ? sidePanelContent.extras.setRowSelection
          : null;
      if (!rowSelection) return null;
      return (
        <DeleteMultipleImagesForm
          closeForm={clearSidePanelContent}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
        />
      );
    }
    case ImageSidePanelViews.DOWNLOAD_IMAGE: {
      return <SelectUpstreamImagesForm />;
    }
    default:
      return null;
  }
};

export default ImagesForms;
