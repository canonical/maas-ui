import { useEffect } from "react";

import { ContentSection } from "@canonical/maas-react-components";
import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import ThirdPartyDriversForm from "../ThirdPartyDriversForm";

import { useWindowTitle } from "@/app/base/hooks";
import { configActions } from "@/app/store/config";
import configSelectors from "@/app/store/config/selectors";

export enum Labels {
  Loading = "Loading...",
}

const ThirdPartyDrivers = (): JSX.Element => {
  const loaded = useSelector(configSelectors.loaded);
  const loading = useSelector(configSelectors.loading);
  const dispatch = useDispatch();

  useWindowTitle("Ubuntu");

  useEffect(() => {
    if (!loaded) {
      dispatch(configActions.fetch());
    }
  }, [dispatch, loaded]);

  return (
    <ContentSection variant="narrow">
      <ContentSection.Title className="section-header__title">
        Ubuntu
      </ContentSection.Title>
      <ContentSection.Content>
        {loading && <Spinner text="Loading..." />}
        {loaded && <ThirdPartyDriversForm />}
      </ContentSection.Content>
    </ContentSection>
  );
};

export default ThirdPartyDrivers;
