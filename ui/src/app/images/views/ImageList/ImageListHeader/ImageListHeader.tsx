import { useEffect } from "react";

import { Icon, Tooltip } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import SectionHeader from "app/base/components/SectionHeader";
import SwitchField from "app/base/components/SwitchField";
import { actions as bootResourceActions } from "app/store/bootresource";
import bootResourceSelectors from "app/store/bootresource/selectors";
import { actions as configActions } from "app/store/config";
import configSelectors from "app/store/config/selectors";
import { breakLines, unindentString } from "app/utils";

const ImageListHeader = (): JSX.Element => {
  const dispatch = useDispatch();
  const polling = useSelector(bootResourceSelectors.polling);
  const autoImport = useSelector(configSelectors.bootImagesAutoImport);
  const configSaving = useSelector(configSelectors.saving);

  useEffect(() => {
    dispatch(bootResourceActions.poll());
    dispatch(configActions.fetch());
  }, [dispatch]);

  return (
    <SectionHeader
      buttons={[
        <div className="u-flex--align-baseline">
          {configSaving && (
            <div className="u-nudge-left--small">
              <Icon className="u-animation--spin" name="spinner" />
            </div>
          )}
          <SwitchField
            checked={autoImport || false}
            className="u-nudge-right"
            data-test="auto-sync-switch"
            id="auto-sync-switch"
            label={
              <span>
                <span>Automatically sync images</span>
                <Tooltip
                  className="u-nudge-right--small"
                  message={breakLines(
                    unindentString(
                      `Enables automatic image updates (sync). The region
                      controller will check for new images every hour and
                      automatically sync them, if available, from the stream
                      configured below. Syncing at the rack controller level
                      occurs every 5 minutes and cannot be disabled.`
                    )
                  )}
                >
                  <Icon name="help"></Icon>
                </Tooltip>
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
            wrapperClassName="u-flex"
          />
        </div>,
      ]}
      loading={polling}
      title="Images"
    />
  );
};

export default ImageListHeader;
