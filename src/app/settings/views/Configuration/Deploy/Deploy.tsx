import { useEffect } from "react";

import { ContentSection, Layout } from "@canonical/maas-react-components";
import { Notification } from "@canonical/react-components";
import { useSelector, useDispatch } from "react-redux";

import { useConfigurations } from "@/app/api/query/configurations";
import PageContent from "@/app/base/components/PageContent";
import { useWindowTitle } from "@/app/base/hooks";
import DeployForm, {
  deployConfigsOptions,
} from "@/app/settings/views/Configuration/DeployForm/DeployForm";
import { configActions } from "@/app/store/config";
import configSelectors from "@/app/store/config/selectors";
import { generalActions } from "@/app/store/general";
import { osInfo as osInfoSelectors } from "@/app/store/general/selectors";

const Deploy = (): React.ReactElement => {
  const configLoaded = useSelector(configSelectors.loaded);
  const osInfoLoaded = useSelector(osInfoSelectors.loaded);
  const loaded = configLoaded && osInfoLoaded;
  const dispatch = useDispatch();
  const { isPending, error, isSuccess } =
    useConfigurations(deployConfigsOptions);

  useWindowTitle("Deploy");

  useEffect(() => {
    if (!loaded) {
      dispatch(configActions.fetch());
      dispatch(generalActions.fetchOsInfo());
    }
  }, [dispatch, loaded]);

  if (isPending || !osInfoLoaded) {
    return (
      <PageContent>
        <Layout.Skeleton view="settings" />
      </PageContent>
    );
  }

  return (
    <PageContent>
      <ContentSection variant="narrow">
        <ContentSection.Title className="section-header__title">
          Deploy
        </ContentSection.Title>
        <ContentSection.Content>
          {error && (
            <Notification
              severity="negative"
              title="Error while fetching deploy configurations"
            >
              {error.message}
            </Notification>
          )}
          {isSuccess && <DeployForm />}
        </ContentSection.Content>
      </ContentSection>
    </PageContent>
  );
};

export default Deploy;
