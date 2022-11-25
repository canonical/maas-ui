import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import MainContentSection from "app/base/components/MainContentSection";
import SectionHeader from "app/base/components/SectionHeader";
import SettingsNav from "app/settings/components/Nav";
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
      <MainContentSection
        header={
          <SectionHeader title="You do not have permission to view this page." />
        }
      />
    );
  }

  return (
    <MainContentSection
      header={<SectionHeader title="Settings" />}
      sidebar={<SettingsNav />}
    >
      <Routes />
    </MainContentSection>
  );
};

export default Settings;
