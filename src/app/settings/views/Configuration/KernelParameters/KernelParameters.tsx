import { useEffect } from "react";

import { ContentSection, Layout } from "@canonical/maas-react-components";
import { Notification } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import KernelParametersForm, {
  kernelParametersConfigsOptions,
} from "../KernelParametersForm/KernelParametersForm";

import { useConfigurations } from "@/app/api/query/configurations";
import PageContent from "@/app/base/components/PageContent";
import { useWindowTitle } from "@/app/base/hooks";
import { configActions } from "@/app/store/config";
import configSelectors from "@/app/store/config/selectors";

const KernelParameters = (): React.ReactElement => {
  const loaded = useSelector(configSelectors.loaded);
  const dispatch = useDispatch();
  const { isPending, error, isSuccess } = useConfigurations(
    kernelParametersConfigsOptions
  );

  useWindowTitle("Kernel parameters");

  useEffect(() => {
    if (!loaded) {
      dispatch(configActions.fetch());
    }
  }, [dispatch, loaded]);

  if (isPending) {
    return <Layout.Skeleton view="settings" />;
  }

  return (
    <PageContent>
      <ContentSection variant="narrow">
        <ContentSection.Title className="section-header__title">
          Kernel parameters
        </ContentSection.Title>
        <ContentSection.Content>
          {error && (
            <Notification
              severity="negative"
              title="Error while fetching kernel parameters configurations"
            >
              {error.message}
            </Notification>
          )}
          {isSuccess && <KernelParametersForm />}
        </ContentSection.Content>
      </ContentSection>
    </PageContent>
  );
};

export default KernelParameters;
