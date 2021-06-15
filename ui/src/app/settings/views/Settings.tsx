import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import Section from "app/base/components/Section";
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
    return <Section header="You do not have permission to view this page." />;
  }

  return (
    <Section header="Settings" sidebar={<SettingsNav />}>
      <Routes />
    </Section>
  );
};

export default Settings;
