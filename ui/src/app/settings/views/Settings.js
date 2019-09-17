import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { config as configActions } from "app/settings/actions";
import Routes from "app/settings/components/Routes";
import Section from "app/base/components/Section";
import SettingsNav from "app/settings/components/Nav";

const Settings = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(configActions.fetch());
  }, [dispatch]);

  return (
    <Section title="Settings" sidebar={<SettingsNav />}>
      <Routes />
    </Section>
  );
};

export default Settings;
