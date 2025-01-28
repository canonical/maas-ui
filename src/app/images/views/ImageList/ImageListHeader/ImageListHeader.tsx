import { type Dispatch, type SetStateAction, useCallback } from "react";

import { MainToolbar } from "@canonical/maas-react-components";
import { Button, Icon, Spinner, Tooltip } from "@canonical/react-components";
import type { RowSelectionState } from "@tanstack/react-table";
import { useDispatch, useSelector } from "react-redux";

import SwitchField from "@/app/base/components/SwitchField";
import TooltipButton from "@/app/base/components/TooltipButton";
import { useFetchActions, useCycled } from "@/app/base/hooks";
import { useSidePanel } from "@/app/base/side-panel-context";
import { ImageSidePanelViews } from "@/app/images/constants";
import { bootResourceActions } from "@/app/store/bootresource";
import bootResourceSelectors from "@/app/store/bootresource/selectors";
import { BootResourceSourceType } from "@/app/store/bootresource/types";
import type { BootResourceUbuntuSource } from "@/app/store/bootresource/types";
import { configActions } from "@/app/store/config";
import configSelectors from "@/app/store/config/selectors";

import "./_index.scss";

type ImageListHeaderProps = {
  selectedRows: RowSelectionState;
  setSelectedRows: Dispatch<SetStateAction<RowSelectionState>>;
};

export enum Labels {
  AutoSyncImages = "Automatically sync images",
  RackControllersImporting = "Step 2/2: Rack controller(s) importing",
  RegionControllerImporting = "Step 1/2: Region controller importing",
}

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

const ImageListHeader = ({
  selectedRows,
  setSelectedRows,
}: ImageListHeaderProps) => {
  const dispatch = useDispatch();
  const ubuntu = useSelector(bootResourceSelectors.ubuntu);
  const resources = useSelector(bootResourceSelectors.resources);
  const polling = useSelector(bootResourceSelectors.polling);
  const autoImport = useSelector(configSelectors.bootImagesAutoImport);
  const configLoaded = useSelector(configSelectors.loaded);
  const configSaving = useSelector(configSelectors.saving);
  const rackImportRunning = useSelector(
    bootResourceSelectors.rackImportRunning
  );
  const regionImportRunning = useSelector(
    bootResourceSelectors.regionImportRunning
  );
  const [hasPolled] = useCycled(!polling);
  const saving = useSelector(bootResourceSelectors.savingUbuntu);
  const imagesDownloading = resources.some((resource) => resource.downloading);
  const stoppingImport = useSelector(bootResourceSelectors.stoppingImport);
  const canStopImport = (saving || imagesDownloading) && !stoppingImport;
  const cleanup = useCallback(() => bootResourceActions.cleanup(), []);

  const { setSidePanelContent } = useSidePanel();
  const isDeleteDisabled = Object.keys(selectedRows).length <= 0;
  const canChangeSource = resources.every((resource) => !resource.downloading);

  const sources = ubuntu?.sources || [];
  const hasSources = sources.length !== 0;

  useFetchActions([configActions.fetch]);

  return (
    <MainToolbar>
      <MainToolbar.Title>
        Images synced from <strong>{getImageSyncText(sources)}</strong>
      </MainToolbar.Title>
      {configLoaded ? (
        <div className="u-flex--align-baseline">
          {configSaving && (
            <div className="u-nudge-left--small">
              <Icon className="u-animation--spin" name="spinner" />
            </div>
          )}
          <SwitchField
            checked={autoImport || false}
            className="u-nudge-right"
            data-testid="auto-sync-switch"
            id="auto-sync-switch"
            label={
              <span>
                <span>{Labels.AutoSyncImages}</span>
                <TooltipButton
                  className="u-nudge-right--small"
                  iconName="help"
                  message={`Enables hourly image updates (sync) from the source configured below.`}
                />
              </span>
            }
            onChange={() => {
              dispatch(configActions.cleanup());
              dispatch(
                configActions.update({
                  boot_images_auto_import: !autoImport,
                })
              );
            }}
            wrapperClassName="u-flex--align-center"
          />
        </div>
      ) : null}
      {polling && !hasPolled ? (
        <Spinner text="Loading..." />
      ) : (
        <span className="u-text--muted">
          {regionImportRunning ? (
            <>
              <Spinner data-testid="region-importing" />{" "}
              {Labels.RegionControllerImporting}
              {canStopImport || stoppingImport ? (
                <Button
                  appearance="link"
                  className="stop-image-import"
                  disabled={stoppingImport}
                  onClick={() => {
                    dispatch(cleanup());
                    dispatch(bootResourceActions.stopImport());
                    dispatch(bootResourceActions.saveUbuntuSuccess());
                    dispatch(bootResourceActions.poll({ continuous: false }));
                  }}
                >
                  {stoppingImport
                    ? "Stopping image import..."
                    : "Stop image import"}
                </Button>
              ) : null}
            </>
          ) : rackImportRunning ? (
            <>
              <Spinner data-testid="rack-importing" />{" "}
              {Labels.RackControllersImporting}
            </>
          ) : null}
        </span>
      )}
      {!!ubuntu && (
        <MainToolbar.Controls>
          <Button
            appearance="negative"
            className="remove-btn"
            disabled={isDeleteDisabled}
            hasIcon
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
            <i className="p-icon--delete is-light" />
            <span>Delete</span>
          </Button>
          <Button
            disabled={canStopImport || stoppingImport}
            hasIcon
            onClick={() =>
              setSidePanelContent({
                view: ImageSidePanelViews.DOWNLOAD_IMAGE,
              })
            }
            type="button"
          >
            <i className="p-icon--begin-downloading" />
            <span>Select upstream images</span>
          </Button>
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
        </MainToolbar.Controls>
      )}
    </MainToolbar>
  );
};

export default ImageListHeader;
