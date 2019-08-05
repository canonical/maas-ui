import React from "react";

import actions from "app/settings/actions";
import selectors from "app/settings/selectors";
import { useFetchOnce } from "app/base/hooks";
import Routes from "../../components/Routes";
import Section from "app/base/components/Section";
import SettingsNav from "../../components/Nav";

const Settings = () => {
  useFetchOnce(actions.config.fetch, selectors.config.loaded);

  return (
    <Section title="Settings" sidebar={<SettingsNav />}>
      <Routes />
    </Section>
  );
};

export default Settings;
