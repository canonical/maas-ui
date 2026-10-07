import { ContentSection } from "@canonical/maas-react-components";
import {
  Notification as NotificationBanner,
  Spinner,
} from "@canonical/react-components";

import WindowsForm, { windowsConfigName } from "../WindowsForm/WindowsForm";

import { useGetConfiguration } from "@/app/api/query/configurations";
import PageContent from "@/app/base/components/PageContent";
import { useWindowTitle } from "@/app/base/hooks";

export enum Labels {
  Loading = "Loading...",
}

const Windows = (): React.ReactElement => {
  const { isPending, error, isSuccess } = useGetConfiguration({
    path: { name: windowsConfigName },
  });

  useWindowTitle("Windows");

  return (
    <PageContent>
      <ContentSection variant="narrow">
        <ContentSection.Title className="section-header__title">
          Windows
        </ContentSection.Title>
        <ContentSection.Content>
          {isPending && <Spinner text={Labels.Loading} />}
          {error && (
            <NotificationBanner
              severity="negative"
              title="Error while fetching image configurations"
            >
              {error.message}
            </NotificationBanner>
          )}
          {isSuccess && <WindowsForm />}
        </ContentSection.Content>
      </ContentSection>
    </PageContent>
  );
};

export default Windows;
