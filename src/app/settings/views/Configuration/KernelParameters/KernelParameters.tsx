import { useEffect } from "react";

import { ContentSection } from "@canonical/maas-react-components";
import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import KernelParametersForm from "../KernelParametersForm";

import { useWindowTitle } from "app/base/hooks";
import { actions as configActions } from "app/store/config";
import configSelectors from "app/store/config/selectors";

export enum Labels {
  Loading = "Loading...",
}

const KernelParameters = (): JSX.Element => {
  const loaded = useSelector(configSelectors.loaded);
  const loading = useSelector(configSelectors.loading);
  const dispatch = useDispatch();

  useWindowTitle("Kernel parameters");

  useEffect(() => {
    if (!loaded) {
      dispatch(configActions.fetch());
    }
  }, [dispatch, loaded]);

  return (
    <ContentSection variant="narrow">
      <ContentSection.Title className="section-header__title">
        Kernel parameters
      </ContentSection.Title>
      <ContentSection.Content>
        {loading && <Spinner text={Labels.Loading} />}
        {loaded && <KernelParametersForm />}
      </ContentSection.Content>
    </ContentSection>
  );
};

export default KernelParameters;
