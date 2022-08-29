import { useEffect } from "react";

import { Icon, Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import SectionHeader from "app/base/components/SectionHeader";
import SwitchField from "app/base/components/SwitchField";
import TooltipButton from "app/base/components/TooltipButton";
import { useCycled } from "app/base/hooks";
import bootResourceSelectors from "app/store/bootresource/selectors";
import type { BootResourceState } from "app/store/bootresource/types";
import { actions as configActions } from "app/store/config";
import configSelectors from "app/store/config/selectors";

export enum Labels {
  AutoSyncImages = "Automatically sync images",
  RackControllersImporting = "Step 2/2: Rack controller(s) importing",
  RegionControllerImporting = "Step 1/2: Region controller importing",
}

const generateImportStatus = (
  rackImportRunning: BootResourceState["rackImportRunning"],
  regionImportRunning: BootResourceState["regionImportRunning"]
) => {
  if (regionImportRunning) {
    return (
      <>
        <Spinner data-testid="region-importing" />{" "}
        {Labels.RegionControllerImporting}
      </>
    );
  } else if (rackImportRunning) {
    return (
      <>
        <Spinner data-testid="rack-importing" />{" "}
        {Labels.RackControllersImporting}
      </>
    );
  }
  return null;
};

const ImageListHeader = (): JSX.Element => {
  const dispatch = useDispatch();
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

  useEffect(() => {
    dispatch(configActions.fetch());
  }, [dispatch]);

  return (
    <SectionHeader
      buttons={
        configLoaded
          ? [
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
                        message={`Enables automatic image updates (sync). The
                        region controller will check for new images every hour
                        and automatically sync them, if available, from the
                        stream configured below. Syncing at the rack controller
                        level occurs every 5 minutes and cannot be disabled.`}
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
              </div>,
            ]
          : null
      }
      subtitle={generateImportStatus(rackImportRunning, regionImportRunning)}
      subtitleLoading={polling && !hasPolled}
      title="Images"
    />
  );
};

export default ImageListHeader;
