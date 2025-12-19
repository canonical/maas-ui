import type { ReactElement } from "react";
import { useEffect, useState } from "react";

import {
  Button,
  Icon,
  Notification,
  Tooltip,
} from "@canonical/react-components";
import type { RowSelectionState } from "@tanstack/react-table";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router";

import { useGetConfiguration } from "@/app/api/query/configurations";
import { useImageSources } from "@/app/api/query/imageSources";
import type { SyncNavigateFunction } from "@/app/base/types";
import urls from "@/app/base/urls";
import ImagesTable from "@/app/images/components/ImagesTable";
import { Labels as ImagesLabels } from "@/app/images/views/ImageList/ImageList";
import ImageListHeader from "@/app/images/views/ImageList/ImageListHeader";
import IntroCard from "@/app/intro/components/IntroCard";
import IntroSection from "@/app/intro/components/IntroSection";
import { bootResourceActions } from "@/app/store/bootresource";
import bootResourceSelectors from "@/app/store/bootresource/selectors";
import { ConfigNames } from "@/app/store/config/types";

export enum Labels {
  Continue = "Continue",
  CantContinue = "At least one image and source must be configured to continue.",
}

const ImagesIntro = (): ReactElement => {
  const dispatch = useDispatch();
  const navigate: SyncNavigateFunction = useNavigate();
  const resources = useSelector(bootResourceSelectors.resources);

  const { data: sources, isPending: sourcesPending } = useImageSources();
  const { data, isPending: configPending } = useGetConfiguration({
    path: { name: ConfigNames.BOOT_IMAGES_AUTO_IMPORT },
  });
  const autoImport = data?.value as boolean;

  const [selectedRows, setSelectedRows] = useState<RowSelectionState>({});

  useEffect(() => {
    dispatch(bootResourceActions.poll({ continuous: true }));

    return () => {
      dispatch(bootResourceActions.pollStop());
    };
  }, [dispatch]);

  const hasSources = (sources?.total ?? 0) > 0;
  const incomplete = !hasSources || resources.length === 0;

  return (
    <IntroSection loading={sourcesPending} windowTitle="Images">
      <IntroCard complete={!incomplete} title="Images">
        <ImageListHeader
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
        />
        {!configPending && (
          <>
            {!autoImport && (
              <Notification
                data-testid="disabled-sync-warning"
                severity="caution"
              >
                {ImagesLabels.SyncDisabled}
              </Notification>
            )}
            <ImagesTable
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
              variant="regular"
            />
          </>
        )}
      </IntroCard>
      <div className="u-align--right">
        <Button element={Link} to={urls.intro.index}>
          Back
        </Button>
        <Button
          appearance="positive"
          data-testid="images-intro-continue"
          disabled={incomplete}
          hasIcon
          onClick={() => {
            navigate({ pathname: urls.intro.success });
          }}
        >
          Continue
          {incomplete && (
            <Tooltip className="u-nudge-right" message={Labels.CantContinue}>
              <Icon className="is-light" name="information" />
            </Tooltip>
          )}
        </Button>
      </div>
    </IntroSection>
  );
};

export default ImagesIntro;
