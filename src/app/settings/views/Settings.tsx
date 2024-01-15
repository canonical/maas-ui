import { useSelector } from "react-redux";

import PageContent from "@/app/base/components/PageContent";
import SectionHeader from "@/app/base/components/SectionHeader";
import { useFetchActions } from "@/app/base/hooks";
import Routes from "@/app/settings/components/Routes";
import authSelectors from "@/app/store/auth/selectors";
import { actions as configActions } from "@/app/store/config";

const Settings = (): JSX.Element => {
  const isAdmin = useSelector(authSelectors.isAdmin);

  useFetchActions([configActions.fetch]);

  if (!isAdmin) {
    return (
      <PageContent
        header={
          <SectionHeader title="You do not have permission to view this page." />
        }
        sidePanelContent={null}
        sidePanelTitle={null}
      />
    );
  }

  return (
    <PageContent sidePanelContent={null} sidePanelTitle={null}>
      <Routes />
    </PageContent>
  );
};

export default Settings;
