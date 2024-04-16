import { useEffect } from "react";

import { Button, Icon, Tooltip } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

import urls from "@/app/base/urls";
import SyncedImages from "@/app/images/views/ImageList/SyncedImages";
import IntroCard from "@/app/intro/components/IntroCard";
import IntroSection from "@/app/intro/components/IntroSection";
import { bootResourceActions } from "@/app/store/bootresource";
import bootResourceSelectors from "@/app/store/bootresource/selectors";

export enum Labels {
  Back = "Back",
  Continue = "Continue",
  CantContinue = "At least one image and source must be configured to continue.",
}

const ImagesIntro = (): JSX.Element => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ubuntu = useSelector(bootResourceSelectors.ubuntu);
  const resources = useSelector(bootResourceSelectors.resources);

  useEffect(() => {
    dispatch(bootResourceActions.poll({ continuous: true }));

    return () => {
      dispatch(bootResourceActions.pollStop());
    };
  }, [dispatch]);

  const hasSources = (ubuntu?.sources || []).length > 0;
  const incomplete = !hasSources || resources.length === 0;

  return (
    <IntroSection loading={!ubuntu} windowTitle="Images">
      <IntroCard complete={!incomplete} title="Images">
        <SyncedImages className="u-no-padding--bottom" />
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
          onClick={() => navigate({ pathname: urls.intro.success })}
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
