import { useEffect } from "react";

import {
  Button,
  Icon,
  Spinner,
  Strip,
  Tooltip,
} from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";

import Section from "app/base/components/Section";
import { useWindowTitle } from "app/base/hooks";
import SyncedImages from "app/images/views/ImageList/SyncedImages";
import introURLs from "app/intro/urls";
import { actions as bootResourceActions } from "app/store/bootresource";
import bootResourceSelectors from "app/store/bootresource/selectors";

const ImagesIntro = (): JSX.Element => {
  const dispatch = useDispatch();
  const history = useHistory();
  const ubuntu = useSelector(bootResourceSelectors.ubuntu);
  const resources = useSelector(bootResourceSelectors.resources);
  useWindowTitle("Welcome - Images");

  useEffect(() => {
    dispatch(bootResourceActions.poll({ continuous: true }));

    return () => {
      dispatch(bootResourceActions.pollStop());
    };
  }, [dispatch]);

  const hasSources = (ubuntu?.sources || []).length > 0;
  const continueDisabled = !hasSources || resources.length === 0;

  return (
    <Section>
      <h4>Images</h4>
      {!ubuntu ? (
        <Strip shallow>
          <Spinner text="Loading..." />
        </Strip>
      ) : (
        <>
          <SyncedImages inCard />
          <div className="u-align--right">
            <Button appearance="neutral" element={Link} to={introURLs.index}>
              Back
            </Button>
            <Button
              appearance="positive"
              data-test="images-intro-continue"
              disabled={continueDisabled}
              hasIcon
              onClick={() => history.push({ pathname: introURLs.success })}
            >
              Continue
              {continueDisabled && (
                <Tooltip
                  className="u-nudge-right"
                  message="At least one image and source must be configured to continue."
                >
                  <Icon className="is-light" name="information" />
                </Tooltip>
              )}
            </Button>
          </div>
        </>
      )}
    </Section>
  );
};

export default ImagesIntro;
