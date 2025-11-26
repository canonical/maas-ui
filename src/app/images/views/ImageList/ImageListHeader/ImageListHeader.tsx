import type { ReactElement, Dispatch, SetStateAction } from "react";
import { useCallback } from "react";

import { MainToolbar } from "@canonical/maas-react-components";
import { Button, Icon, Spinner } from "@canonical/react-components";
import type { RowSelectionState } from "@tanstack/react-table";
import { useDispatch, useSelector } from "react-redux";

import { useImageSources } from "@/app/api/query/imageSources";
import type { BootSourceResponse } from "@/app/apiclient";
import { useFetchActions, useCycled } from "@/app/base/hooks";
import { useSidePanel } from "@/app/base/side-panel-context-new";
import DeleteImages from "@/app/images/components/DeleteImages";
import SelectUpstreamImagesForm from "@/app/images/components/SelectUpstreamImagesForm";
import { bootResourceActions } from "@/app/store/bootresource";
import bootResourceSelectors from "@/app/store/bootresource/selectors";
import { BootResourceSourceType } from "@/app/store/bootresource/types";
import { configActions } from "@/app/store/config";
import configSelectors from "@/app/store/config/selectors";

import "./_index.scss";

type ImageListHeaderProps = {
  selectedRows: RowSelectionState;
  setSelectedRows: Dispatch<SetStateAction<RowSelectionState>>;
};

export enum Labels {
  RackControllersImporting = "Step 2/2: Rack controller(s) importing",
  RegionControllerImporting = "Step 1/2: Region controller importing",
}

const getImageSyncText = (sources: BootSourceResponse[]) => {
  if (sources.length === 1) {
    const mainSource = sources[0];
    const sourceType = /^https?:\/\/images\.maas\.io\/.*\/stable\/?$/.test(
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
  const dispatch = useDispatch();
  const resources = useSelector(bootResourceSelectors.resources);
  const polling = useSelector(bootResourceSelectors.polling);
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

  const { openSidePanel } = useSidePanel();
  const isDeleteDisabled = Object.keys(selectedRows).length <= 0;

  const { data, isPending } = useImageSources();

  const sources = data?.items || [];

  useFetchActions([configActions.fetch]);

  return (
    <MainToolbar>
      <>
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
          </div>
        ) : null}
        {(polling && !hasPolled) || isPending ? (
          <Spinner text="Loading..." />
        ) : (
          <span className="u-text--muted">
            {regionImportRunning ? (
              <>
                <Spinner data-testid="region-importing" />{" "}
                {Labels.RegionControllerImporting}
              </>
            ) : rackImportRunning ? (
              <>
                <Spinner data-testid="rack-importing" />{" "}
                {Labels.RackControllersImporting}
              </>
            ) : null}
          </span>
        )}
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
            {stoppingImport ? "Stopping image import..." : "Stop image import"}
          </Button>
        ) : null}
        <MainToolbar.Controls>
          <Button
            appearance="negative"
            className="remove-btn"
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
            disabled={canStopImport || stoppingImport}
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
