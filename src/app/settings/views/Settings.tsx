import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import PageContent from "app/base/components/PageContent";
import SectionHeader from "app/base/components/SectionHeader";
import Routes from "app/settings/components/Routes";
import authSelectors from "app/store/auth/selectors";
import { actions as configActions } from "app/store/config";

const Settings = (): JSX.Element => {
  const dispatch = useDispatch();
  const isAdmin = useSelector(authSelectors.isAdmin);

  useEffect(() => {
    dispatch(configActions.fetch());
  }, [dispatch]);

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
