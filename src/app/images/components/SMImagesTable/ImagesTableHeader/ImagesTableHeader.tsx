import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
} from "react";

import { Button, Icon, Tooltip } from "@canonical/react-components";
import type { RowSelectionState } from "@tanstack/react-table";
import { useDispatch, useSelector } from "react-redux";

import { useSidePanel } from "@/app/base/side-panel-context";
import { ImageSidePanelViews } from "@/app/images/constants";
import { bootResourceActions } from "@/app/store/bootresource";
import bootResourceSelectors from "@/app/store/bootresource/selectors";
import type { BootResourceUbuntuSource } from "@/app/store/bootresource/types";
import { BootResourceSourceType } from "@/app/store/bootresource/types";

type ImagesTableHeaderProps = {
  selectedRows: RowSelectionState;
  setSelectedRows: Dispatch<SetStateAction<RowSelectionState>>;
};

const getImageSyncText = (sources: BootResourceUbuntuSource[]) => {
  if (sources.length === 1) {
    const mainSource = sources[0];
    if (mainSource.source_type === BootResourceSourceType.MAAS_IO) {
      return "maas.io";
    }
    return mainSource.url;
  }
  return "sources";
};

const ImagesTableHeader = ({
  selectedRows,
  setSelectedRows,
}: ImagesTableHeaderProps) => {
  const dispatch = useDispatch();
  const ubuntu = useSelector(bootResourceSelectors.ubuntu);
  const resources = useSelector(bootResourceSelectors.resources);
  const { setSidePanelContent } = useSidePanel();
  const sources = ubuntu?.sources || [];
  const hasSources = sources.length !== 0;

  const saving = useSelector(bootResourceSelectors.savingUbuntu);
  const stoppingImport = useSelector(bootResourceSelectors.stoppingImport);
  const cleanup = useCallback(() => bootResourceActions.cleanup(), []);

  useEffect(() => {
    if (!hasSources) {
      setSidePanelContent({
        view: ImageSidePanelViews.CHANGE_SOURCE,
        extras: { hasSources },
      });
    }
  }, [hasSources, setSidePanelContent]);

  const imagesDownloading = resources.some((resource) => resource.downloading);
  const canStopImport = (saving || imagesDownloading) && !stoppingImport;

  const isDeleteDisabled = Object.keys(selectedRows).length <= 0;

  const canChangeSource = resources.every((resource) => !resource.downloading);
  return (
    <div>
      <div className="u-flex--between">
        <h4 data-testid="image-sync-text">
          Showing images synced from{" "}
          <strong>{getImageSyncText(sources)}</strong>
        </h4>
        <div>
          <Button
            appearance="negative"
            className="remove-btn"
            disabled={isDeleteDisabled}
            onClick={() => {
              setSidePanelContent({
                view: ImageSidePanelViews.DELETE_MULTIPLE_IMAGES,
                extras: {
                  rowSelection: selectedRows,
                  setRowSelection: setSelectedRows,
                },
              });
            }}
            type="button"
          >
            Delete
          </Button>
          {canStopImport || stoppingImport ? (
            <Button
              onClick={() => {
                dispatch(cleanup());
                dispatch(bootResourceActions.stopImport());
                dispatch(bootResourceActions.saveUbuntuSuccess());
                dispatch(bootResourceActions.poll({ continuous: false }));
              }}
              type="button"
            >
              {stoppingImport ? "Stopping image import..." : "Stop import"}
            </Button>
          ) : (
            <Button
              onClick={() =>
                setSidePanelContent({
                  view: ImageSidePanelViews.DOWNLOAD_IMAGE,
                })
              }
              type="button"
            >
              Download images
            </Button>
          )}
          <Button
            data-testid="change-source-button"
            disabled={!canChangeSource}
            onClick={() =>
              setSidePanelContent({
                view: ImageSidePanelViews.CHANGE_SOURCE,
                extras: { hasSources },
              })
            }
          >
            Change source
            {!canChangeSource && (
              <Tooltip
                className="u-nudge-right--small"
                message="Cannot change source while images are downloading."
                position="top-right"
              >
                <Icon name="information" />
              </Tooltip>
            )}
          </Button>
        </div>
      </div>
      <hr />
    </div>
  );
};

export default ImagesTableHeader;
