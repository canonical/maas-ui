import type { Dispatch, ReactElement, SetStateAction } from "react";

import { MainToolbar } from "@canonical/maas-react-components";
import { Button, Spinner } from "@canonical/react-components";
import type { RowSelectionState } from "@tanstack/react-table";

import { useImageSources } from "@/app/api/query/imageSources";
import { useSelectionStatuses } from "@/app/api/query/images";
import type { BootSourceResponse } from "@/app/apiclient";
import { useSidePanel } from "@/app/base/side-panel-context";
import DeleteImages from "@/app/images/components/DeleteImages";
import SelectUpstreamImagesForm from "@/app/images/components/SelectUpstreamImagesForm";
import UploadCustomImage from "@/app/images/components/UploadCustomImage";
import { MAAS_IO_DEFAULTS } from "@/app/images/constants";
import { BootResourceSourceType } from "@/app/images/types";

type ImageListHeaderProps = {
  selectedRows: RowSelectionState;
  setSelectedRows: Dispatch<SetStateAction<RowSelectionState>>;
};

const getImageSyncText = (sources: BootSourceResponse[]) => {
  if (sources.length === 1) {
    const mainSource = sources[0];
    const sourceType = new RegExp(MAAS_IO_DEFAULTS.url).test(
      mainSource.url ?? ""
    )
      ? BootResourceSourceType.MAAS_IO
      : BootResourceSourceType.CUSTOM;
    if (sourceType === BootResourceSourceType.MAAS_IO) {
      return "maas.io";
    }
    return mainSource.url;
  }
  return "sources";
};

const ImageListHeader = ({
  selectedRows,
  setSelectedRows,
}: ImageListHeaderProps): ReactElement => {
  const { openSidePanel } = useSidePanel();

  const sources = useImageSources();
  const selectionsStatuses = useSelectionStatuses();

  const isPending = sources.isPending || selectionsStatuses.isPending;
  const isDeleteDisabled = Object.keys(selectedRows).length <= 0;

  return (
    <MainToolbar>
      <>
        <MainToolbar.Title>
          Images synced from{" "}
          <strong>{getImageSyncText(sources.data?.items ?? [])}</strong>
        </MainToolbar.Title>
        {isPending ? <Spinner text="Loading..." /> : null}
        <MainToolbar.Controls>
          <Button
            appearance="negative"
            disabled={isDeleteDisabled}
            hasIcon
            onClick={() => {
              openSidePanel({
                component: DeleteImages,
                props: {
                  rowSelection: selectedRows,
                  setRowSelection: setSelectedRows,
                },
                title: "Delete images",
              });
            }}
            type="button"
          >
            <i className="p-icon--delete is-light" />
            <span>Delete</span>
          </Button>
          <Button
            hasIcon
            onClick={() => {
              openSidePanel({
                component: UploadCustomImage,
                title: "Upload custom image",
              });
            }}
            type="button"
          >
            <i className="p-icon--upload" />
            <span>Upload custom image</span>
          </Button>
          <Button
            hasIcon
            onClick={() => {
              openSidePanel({
                component: SelectUpstreamImagesForm,
                title: "Select upstream images to sync",
              });
            }}
            type="button"
          >
            <i className="p-icon--begin-downloading" />
            <span>Select upstream images</span>
          </Button>
        </MainToolbar.Controls>
      </>
    </MainToolbar>
  );
};

export default ImageListHeader;
