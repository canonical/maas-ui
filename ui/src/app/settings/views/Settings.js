import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { auth as authSelectors } from "app/base/selectors";
import { config as configActions } from "app/settings/actions";
import Routes from "app/settings/components/Routes";
import Section from "app/base/components/Section";
import SettingsNav from "app/settings/components/Nav";

const Settings = () => {
  const dispatch = useDispatch();
  const authUser = useSelector(authSelectors.get);

  useEffect(() => {
    dispatch(configActions.fetch());
  }, [dispatch]);

  if (!authUser || !authUser.is_superuser) {
    return <Section header="You do not have permission to view this page." />;
  }

  return (
    <Section header="Settings" sidebar={<SettingsNav />}>
      <Routes />
    </Section>
  );
};

export default Settings;
