import { useEffect } from "react";

import { ContentSection } from "@canonical/maas-react-components";
import { Spinner } from "@canonical/react-components";
import { useSelector, useDispatch } from "react-redux";

import { useWindowTitle } from "@/app/base/hooks";
import DeployForm from "@/app/settings/views/Configuration/DeployForm";
import { configActions } from "@/app/store/config";
import configSelectors from "@/app/store/config/selectors";
import { generalActions } from "@/app/store/general";
import { osInfo as osInfoSelectors } from "@/app/store/general/selectors";

const Deploy = (): JSX.Element => {
  const configLoaded = useSelector(configSelectors.loaded);
  const configLoading = useSelector(configSelectors.loading);
  const osInfoLoaded = useSelector(osInfoSelectors.loaded);
  const osInfoLoading = useSelector(osInfoSelectors.loading);
  const loaded = configLoaded && osInfoLoaded;
  const loading = configLoading || osInfoLoading;
  const dispatch = useDispatch();

  useWindowTitle("Deploy");

  useEffect(() => {
    if (!loaded) {
      dispatch(configActions.fetch());
      dispatch(generalActions.fetchOsInfo());
    }
  }, [dispatch, loaded]);

  return (
    <ContentSection variant="narrow">
      <ContentSection.Title className="section-header__title">
        Deploy
      </ContentSection.Title>
      <ContentSection.Content>
        {loading && <Spinner text="Loading..." />}
        {loaded && <DeployForm />}
      </ContentSection.Content>
    </ContentSection>
  );
};

export default Deploy;
